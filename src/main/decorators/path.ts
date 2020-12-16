/* eslint-disable @typescript-eslint/naming-convention */
import { addRouteMetadataToEndpoint, getEndpoint } from "../core"
import { FunctionKeys } from "../types"

export const Path = (name: string): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "path", 
        name, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}