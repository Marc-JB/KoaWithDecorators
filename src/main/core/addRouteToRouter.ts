import Router from "@koa/router"
import { InferConstructorType, Route, FunctionKeys, Parameter, IndexableParameter } from "../types"
import { buildParameterList } from "./buildParameterList"

export function addRouteToRouter<
    T extends new (...args: any[]) => Object
>(
    router: Router,
    routeId: FunctionKeys<T>,
    routeOpts: Route,
    instance: InferConstructorType<T>
): void {
    const {
        path = "/",
        method = "*",
        defaultStatusCode = null,
        cachedFor = null,
        download = false,
        params = new Map<number, Parameter | IndexableParameter>()
    } = routeOpts

    const func: Router.Middleware = async (context, next): Promise<any> => {
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
            context.response.set("Content-Disposition", "attachment" + typeof download === "string" ? ` filename="${download}"` : "")
        }

        const paramsList = buildParameterList(params, context, next)

        try {
            // @ts-expect-error
            const response = await instance[routeId](...paramsList)

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
            throw new Error(`${routeId.toString()} | ${path}: Method ${method} not supported`)
        }
    }
}
