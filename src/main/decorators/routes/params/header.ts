/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

export const Header: (name: string) => ParameterDecorator = (name) => (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "header", name }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}

export const AuthorizationHeader = Header("Authorization")
export const AuthHeader = AuthorizationHeader
