import Router from "@koa/router"
import { Next } from "koa"
import { AuthenticationType, BasicAuth, BearerToken } from "../authentication"
import { IndexableParameter, Parameter } from "../types"

export function buildParameterList(
    params: Map<number, Parameter | IndexableParameter>,
    context: Router.RouterContext,
    next: Next
): any[] {
    const paramsList = []

    if (params.size === 0) {
        paramsList.push(context, next)
    } else {
        for (const [index, param] of params) {
            switch (param.type) {
                case "context": {
                    paramsList[index] = context
                    break
                }
                case "next": {
                    paramsList[index] = next
                    break
                }
                case "params": {
                    paramsList[index] = context.params
                    break
                }
                case "request": {
                    paramsList[index] = context.request
                    break
                }
                case "response": {
                    paramsList[index] = context.response
                    break
                }
                case "body": {
                    paramsList[index] = (context.request as { body?: any }).body
                    break
                }
                case "headers": {
                    paramsList[index] = context.request.headers
                    break
                }
                case "queries": {
                    paramsList[index] = context.request.query
                    break
                }
                case "header": {
                    paramsList[index] = context.request.get(param.name)
                    break
                }
                case "query": {
                    paramsList[index] = context.request.query[param.name]
                    break
                }
                case "param": {
                    paramsList[index] = context.params[param.name]
                    break
                }
                case "auth": {
                    const authHeader = context.request.get("Authorization")
                    let authObj: AuthenticationType | null = null
                    if (typeof authHeader === "string") {
                        if (authHeader.startsWith("Basic ")) {
                            authObj = new BasicAuth(authHeader.replace("Basic ", ""))
                        } else if (authHeader.startsWith("Bearer ")) {
                            authObj = new BearerToken(authHeader.replace("Bearer ", ""))
                        }
                    }
                    paramsList[index] = authObj
                    break
                }
                case "bearer": {
                    const authHeader = context.request.get("Authorization")
                    let token: string | null = null
                    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
                        token = authHeader.replace("Bearer ", "")
                    }
                    paramsList[index] = token
                    break
                }
                default: {
                    paramsList[index] = null
                    break
                }
            }
        }
    }

    return paramsList
}
