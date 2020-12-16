/* eslint-disable @typescript-eslint/naming-convention */
import Router from "@koa/router"
import { addRouteMetadataToEndpoint, addRoutesToRouter, getEndpoint } from "./core"
import { Route, Endpoint, InferConstructorType, FunctionKeys } from "./types"

const HttpMethod = (name: string): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "method", 
        name.toUpperCase(), 
        target.constructor as Endpoint<ObjectConstructor>, 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}

export const HttpGet: MethodDecorator = HttpMethod("GET")
export const GET: MethodDecorator = HttpMethod("GET")

export const HttpPost: MethodDecorator = HttpMethod("POST")
export const POST: MethodDecorator = HttpMethod("POST")

export const HttpPut: MethodDecorator = HttpMethod("PUT")
export const PUT: MethodDecorator = HttpMethod("PUT")

export const HttpPatch: MethodDecorator = HttpMethod("PATCH")
export const PATCH: MethodDecorator = HttpMethod("PATCH")

export const HttpDelete: MethodDecorator = HttpMethod("DELETE")
export const DELETE: MethodDecorator = HttpMethod("DELETE")

export const HttpOptions: MethodDecorator = HttpMethod("OPTIONS")
export const OPTIONS: MethodDecorator = HttpMethod("OPTIONS")

export const HttpHead: MethodDecorator = HttpMethod("HEAD")
export const HEAD: MethodDecorator = HttpMethod("HEAD")

export const HttpAll: MethodDecorator = HttpMethod("*")

export const Path = (name: string): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "path", 
        name, 
        target.constructor as Endpoint<ObjectConstructor>, 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}

export const DefaultStatusCode = (code: number): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "defaultStatusCode", 
        code, 
        target.constructor as Endpoint<ObjectConstructor>, 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}

const timeFactors = {
    seconds: 1,
    minutes: 60,
    hour: 60 * 60,
    days: 24 * 60 * 60,
    weeks: 7 * 24 * 60 * 60
}

export const CachedFor = (time: number, unit: keyof typeof timeFactors): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "cachedFor", 
        time * timeFactors[unit], 
        target.constructor as Endpoint<ObjectConstructor>, 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}

export const Controller: ClassDecorator | ((name: string) => ClassDecorator) = (nameOrConstructor: any): any => {
    if (typeof nameOrConstructor === "string") {
        return (constructor: any): void => {
            getEndpoint(constructor).path = nameOrConstructor
        }
    } else getEndpoint(nameOrConstructor).path = "/"
}

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
