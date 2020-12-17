/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { addRouteMetadataToEndpoint } from "../../../core/addRouteMetadataToEndpoint"
import { FunctionKeys } from "../../../types"

const HttpMethod = (name: string): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "method", 
        name.toUpperCase(), 
        getEndpoint<ObjectConstructor>(target.constructor), 
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