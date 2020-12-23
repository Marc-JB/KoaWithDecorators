import { getEndpoint } from "../core/getEndpoint"
import { IndexableParameter, InferConstructorType, Parameter } from "../types"

function removeSurroundings(str: string, char: string): string {
    if (str.startsWith(char)) str = str.substr(char.length)
    if (str.endsWith(char)) str = str.substr(0, str.length - char.length)
    return str
}

export function getOpenApiPathsJson<
    T extends new (...args: any[]) => Object
>(instance: InferConstructorType<T>): any {
    const endpoint = getEndpoint<T>(instance.constructor)
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
        paths[url] = paths[url] ?? {}

        const spec: {[key: string]: any} = {
            summary: `${instance.constructor.name}.${id}`,
            operationId: id,
            consumes: [ "application/json" ],
            produces: [ "application/json" ]
        }

        const params = route.params ?? new Map<number, Parameter | IndexableParameter>()

        for (const [_, param] of params) {
            if (param.type === "body") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.add({
                    in: "body",
                    name: "body",
                    schema: {
                        type: "object"
                    }
                })
            } else if (param.type === "param") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.add({
                    in: "path",
                    name: param.name,
                    required: true,
                    type: "string"
                })
            } else if (param.type === "header") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.add({
                    in: "header",
                    name: param.name,
                    required: true,
                    type: "string"
                })
            } else if (param.type === "query") {
                spec.parameters = spec.parameters ?? []
                spec.parameters.add({
                    in: "query",
                    name: param.name,
                    type: "string"
                })
            } else if (param.type === "bearer") {
                spec.security = {
                    "bearerAuth": []
                }
            } else if (param.type === "auth") {
                spec.security = {
                    "bearerAuth": [],
                    "basicAuth": []
                }
            }
        }

        const method = route.method ?? "*"
        paths[url][method] = {
            operationId: `${instance.constructor.name} - ${id}`
        }
    }

    return { 
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