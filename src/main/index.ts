/* eslint-disable @typescript-eslint/naming-convention */
import Router from "@koa/router"
import { addRoutesToRouter, getEndpoint } from "./core"
import { Route, InferConstructorType, FunctionKeys } from "./types"

export * from "./decorators/httpMethods"
export * from "./decorators/path"
export * from "./decorators/statusCode"
export * from "./decorators/cache"

interface ControllerDecoratorType {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (name: string): (<TFunction extends Function>(target: TFunction) => TFunction | void)

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    <TFunction extends Function>(target: TFunction): TFunction | void
}

export const Controller: ControllerDecoratorType = (nameOrConstructor: any): any => {
    if (typeof nameOrConstructor === "string") {
        return (constructor: any): void => {
            getEndpoint(constructor).path = nameOrConstructor
        }
    } else getEndpoint(nameOrConstructor).path = "/"
}

/** @deprecated use Controller */
export const ApiController = Controller

/** @deprecated use Controller */
export const Endpoint = Controller

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
