import Router from "@koa/router"
import { constructPath } from "../constructPath"
import { HttpStatusCodes } from "../HttpStatusCodes"
import { InferConstructorType, Route, FunctionKeys, Parameter, IndexableParameter } from "../types"
import { buildParameterList } from "./buildParameterList"

export function addRouteToRouter<
    T extends new (...args: any[]) => Object
>(
    router: Router,
    routeId: FunctionKeys<T>,
    routeOpts: Route,
    instance: InferConstructorType<T>,
    prefix: string | null = null
): void {
    const {
        path = "/",
        method = "*",
        defaultStatusCode = null,
        cachedFor = null,
        download = false,
        redirect = null,
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

        if (redirect !== null) {
            context.response.set("Location", redirect.location)
            context.response.status = redirect.isPermanent ? HttpStatusCodes.PermanentRedirect : HttpStatusCodes.TemporaryRedirect
        }

        const paramsList = buildParameterList(params, context, next)

        try {
            // @ts-expect-error
            const response = await instance[routeId](...paramsList)

            if (defaultStatusCode === "auto" && redirect === null) {
                if (method === "POST")
                    context.response.status = HttpStatusCodes.Created
                else if (response === null || response === undefined)
                    context.response.status = HttpStatusCodes.NoContent
                else
                    context.response.status = HttpStatusCodes.OK
            }

            return response
        } catch (error) {
            if (defaultStatusCode === "auto")
                context.response.status = HttpStatusCodes.InternalServerError

            throw error
        }
    }

    const pathWithPrefix = constructPath(prefix, path)

    switch (method) {
        case "GET": {
            router.get(pathWithPrefix, func)
            break
        }
        case "POST": {
            router.post(pathWithPrefix, func)
            break
        }
        case "PUT": {
            router.put(pathWithPrefix, func)
            break
        }
        case "PATCH": {
            router.patch(pathWithPrefix, func)
            break
        }
        case "DELETE": {
            router.delete(pathWithPrefix, func)
            break
        }
        case "OPTIONS": {
            router.options(pathWithPrefix, func)
            break
        }
        case "HEAD": {
            router.head(pathWithPrefix, func)
            break
        }
        case "*": {
            router.all(pathWithPrefix, func)
            break
        }
        default: {
            throw new Error(`${routeId.toString()} | ${pathWithPrefix}: Method ${method} not supported`)
        }
    }
}
