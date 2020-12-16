/* eslint-disable @typescript-eslint/naming-convention */
import { addRouteMetadataToEndpoint, getEndpoint } from "../core"
import { FunctionKeys } from "../types"

export const DefaultStatusCode = (code: number): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "defaultStatusCode", 
        code, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}