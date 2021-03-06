import Router from "@koa/router"
import { InferConstructorType, Route, FunctionKeys } from "../types"
import { addRouteToRouter } from "./addRouteToRouter"

export function addRoutesToRouter<
    T extends new (...args: any[]) => Object
>(
    router: Router, 
    routes: Map<FunctionKeys<T>, Route>, 
    instance: InferConstructorType<T>,
    prefix: string | null = null
): Router {
    for (const [id, options] of routes) {
        addRouteToRouter(router, id, options, instance, prefix)
    }

    return router
}