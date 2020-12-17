/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { addRouteMetadataToEndpoint } from "../../../core/addRouteMetadataToEndpoint"
import { FunctionKeys } from "../../../types"

export const Redirect = (newLocation: string, isPermanentRedirect: boolean = false): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "redirect", 
        { location: newLocation, isPermanent: isPermanentRedirect }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}