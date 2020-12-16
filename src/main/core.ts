import Router from "@koa/router"
import { Endpoint, InferConstructorType, Route, FunctionKeys } from "./types"

export function getEndpoint<T extends new (...args: any[]) => Object>(constructor: Function): Endpoint<T> {
    return constructor as unknown as Endpoint<T>
}

export function addRouteMetadataToEndpoint<T extends new (...args: any[]) => Object, K extends keyof Route>(
    key: K, 
    data: Route[typeof key], 
    endpoint: Endpoint<T>,
    id: FunctionKeys<T>, 
): void {
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    const route = routes.get(id) ?? {}
    route[key] = data
    routes.set(id, route)

    endpoint.routes = routes
}

export function addRoutesToRouter<
    T extends new (...args: any[]) => Object, 
    R extends InferConstructorType<T>
>(
    router: Router, 
    routes: Map<FunctionKeys<T>, Route>, 
    instance: R
): Router {
    for (const [id, { path = "/", method = "*", defaultStatusCode = null, cachedFor = null }] of routes) {
        
        const func: Router.Middleware = (context, ...rest): any => {
            if (defaultStatusCode !== null) {
                context.response.status = defaultStatusCode
            }

            if (cachedFor !== null) {
                const now = new Date()
                now.setTime(now.getTime() + cachedFor * 1000)
                context.response.set("Cache-Control", `public, max-age=${cachedFor}, s-maxage=${cachedFor}`)
                context.response.set("Expires", now.toUTCString())
            }

            // @ts-expect-error
            return instance[id](context, ...rest)
        }

        switch (method) {
            case "GET": {
                router.get(path, func)
                break
            }
            case "POST": {
                router.post(path, func)
                break
            }
            case "PUT": {
                router.put(path, func)
                break
            }
            case "PATCH": {
                router.patch(path, func)
                break
            }
            case "DELETE": {
                router.delete(path, func)
                break
            }
            case "OPTIONS": {
                router.options(path, func)
                break
            }
            case "HEAD": {
                router.head(path, func)
                break
            }
            case "*": {
                router.all(path, func)
                break
            }
            default: {
                throw new Error(`${id.toString()} | ${path}: Method ${method} not supported`)
            }
        }
    }

    return router
}