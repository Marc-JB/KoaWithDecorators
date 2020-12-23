import { getEndpoint } from "../core/getEndpoint"
import { HttpStatusCodes } from "../HttpStatusCodes"
import { IndexableParameter, Parameter } from "../types"

function removeSurroundings(str: string, char: string): string {
    if (str.startsWith(char)) str = str.substr(char.length)
    if (str.endsWith(char)) str = str.substr(0, str.length - char.length)
    return str
}

export function getOpenApiPathsJson<
    T extends new (...args: any[]) => Object
>(instance: T): any {
    const endpoint = getEndpoint<T>(instance)
    const basePath = removeSurroundings(endpoint.path ?? "/", "/")
        .split("/")
        .filter(it => it !== "")
        .map(it => it.startsWith(":") ? `{${it.substr(1)}}` : it)
    const paths: {[key: string]: any} = {}

    for (const [id, route] of endpoint.routes ?? []) {
        const routePath = removeSurroundings(route.path ?? "/", "/")
            .split("/")
            .filter(it => it !== "")
            .map(it => it.startsWith(":") ? `{${it.substr(1)}}` : it)
        const path = [...basePath, ...routePath]
        const url = "/" + path.join("/")
        if (!(url in paths)) {
            paths[url] = {}
        }

        const spec: {[key: string]: any} = {
            tags: [ instance.name ],
            summary: `${instance.name}.${id}`,
            operationId: `${instance.name}.${id}`,
            responses: {}
        }

        for (const desc in HttpStatusCodes) {
            const code = (HttpStatusCodes as {[key: string]: number})[desc]
            spec.responses[code.toString()] = { description: desc }
        }

        const params = route.params ?? new Map<number, Parameter | IndexableParameter>()

        for (const [_, param] of params) {
            if (param.type === "body") {
                spec.requestBody = {
                    content: {
                        "application/json": {}
                    }
                }
            } else if (param.type === "param") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.push({
                    in: "path",
                    name: param.name,
                    required: true,
                    schema: {
                        type: "string"
                    }
                })
            } else if (param.type === "header") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.push({
                    in: "header",
                    name: param.name,
                    schema: {
                        type: "string"
                    }
                })
            } else if (param.type === "query") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.push({
                    in: "query",
                    name: param.name,
                    schema: {
                        type: "string"
                    }
                })
            } else if (param.type === "bearer") {
                spec.security = [
                    { "bearerAuth": [] }
                ]
            } else if (param.type === "auth") {
                spec.security = [
                    { "bearerAuth": [] },
                    { "basicAuth": [] }
                ]
            }
        }

        const method = route.method ?? "*"
        for (const mtd of method === "*" ? ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : [method]) {
            paths[url][mtd.toLowerCase()] = spec
        }
    }

    return { 
        openapi: "3.0.1",
        paths, 
        components: { 
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }, basicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        } 
    }
}