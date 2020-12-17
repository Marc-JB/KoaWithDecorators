/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { addRouteMetadataToEndpoint } from "../../../core/addRouteMetadataToEndpoint"
import { FunctionKeys } from "../../../types"

export const DefaultStatusCode = (code: number | "auto"): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "defaultStatusCode", 
        code, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}