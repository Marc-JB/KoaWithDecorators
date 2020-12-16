import Router from "@koa/router"
import { getEndpoint } from "./core/getEndpoint"
import { addRoutesToRouter } from "./core/addRoutesToRouter"
import { Route, InferConstructorType, FunctionKeys } from "./types"

export * from "./decorators/routes/request/httpMethods"
export * from "./decorators/routes/request/path"
export * from "./decorators/routes/response/statusCode"
export * from "./decorators/routes/response/download"
export * from "./decorators/routes/response/cache"
export * from "./decorators/class/controller"

export const createRouter = <
    T extends new (...args: any[]) => Object, 
    R extends InferConstructorType<T>
>(instance: R): Router => {
    const endpoint = getEndpoint<T>(instance.constructor)
    const path = endpoint.path ?? "/"
    const router = new Router({
        prefix: path.startsWith("/") ? path : "/" + path
    })
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    return addRoutesToRouter(router, routes, instance)
}