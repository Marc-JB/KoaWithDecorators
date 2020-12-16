import Router from "@koa/router"
import { InferConstructorType, Route, FunctionKeys } from "../types"

export function addRoutesToRouter<
    T extends new (...args: any[]) => Object, 
    R extends InferConstructorType<T>
>(
    router: Router, 
    routes: Map<FunctionKeys<T>, Route>, 
    instance: R
): Router {
    for (const [
        id, 
        { 
            path = "/", 
            method = "*", 
            defaultStatusCode = null, 
            cachedFor = null,
            download = false,
        }] of routes) {
        
        const func: Router.Middleware = async (context, ...rest): Promise<any> => {
            if (defaultStatusCode !== null && defaultStatusCode !== "auto") {
                context.response.status = defaultStatusCode
            }

            if (cachedFor !== null) {
                const now = new Date()
                now.setTime(now.getTime() + cachedFor * 1000)
                context.response.set("Cache-Control", `public, max-age=${cachedFor}, s-maxage=${cachedFor}`)
                context.response.set("Expires", now.toUTCString())
            }

            if (download !== false) {
                context.response.set("Content-Disposition", "attachment" + typeof download === "string" ? `; filename="${download}"` : "")
            }

            try {
                // @ts-expect-error
                const response = await instance[id](context, ...rest)

                if (defaultStatusCode === "auto") {
                    if (method === "POST")
                        context.response.status = 201
                    else if (response === null || response === undefined) 
                        context.response.status = 204
                    else
                        context.response.status = 200
                }

                return response
            } catch (error) {
                if (defaultStatusCode === "auto")
                    context.response.status = 500

                throw error
            }
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