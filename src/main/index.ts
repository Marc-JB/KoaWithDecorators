import Router from "@koa/router"
import { getEndpoint } from "./core/getEndpoint"
import { addRoutesToRouter } from "./core/addRoutesToRouter"
import { Route, InferConstructorType, FunctionKeys } from "./types"

export * from "./decorators/routes/request/httpMethods"
export * from "./decorators/routes/request/path"
export * from "./decorators/routes/response/statusCode"
export * from "./decorators/routes/response/download"
export * from "./decorators/routes/response/cache"
export * from "./decorators/routes/response/redirect"
export * from "./decorators/routes/params/body"
export * from "./decorators/routes/params/context"
export * from "./decorators/routes/params/header"
export * from "./decorators/routes/params/headers"
export * from "./decorators/routes/params/next"
export * from "./decorators/routes/params/params"
export * from "./decorators/routes/params/query"
export * from "./decorators/routes/params/request"
export * from "./decorators/routes/params/response"
export * from "./decorators/routes/params/param"
export * from "./decorators/routes/params/auth"
export * from "./decorators/class/controller"
export * from "./HttpStatusCodes"
export * from "./authentication"

export const createRouter = <
    T extends new (...args: any[]) => Object
>(instance: InferConstructorType<T>): Router => {
    const endpoint = getEndpoint<T>(instance.constructor)
    const path = endpoint.path ?? "/"
    const router = new Router({
        prefix: path.startsWith("/") ? path : "/" + path
    })
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    return addRoutesToRouter(router, routes, instance)
}

export const attachRoutesToRouter = <
    T extends new (...args: any[]) => Object
>(instance: InferConstructorType<T>, router: Router): Router => {
    const endpoint = getEndpoint<T>(instance.constructor)
    const path = endpoint.path ?? "/"
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    return addRoutesToRouter(router, routes, instance, path.startsWith("/") ? path : "/" + path)
}