/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

export const Auth: ParameterDecorator = (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "auth" }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}

export const Bearer: ParameterDecorator = (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "bearer" }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}
