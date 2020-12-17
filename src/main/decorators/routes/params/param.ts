/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

export const Param: (name: string) => ParameterDecorator = (name) => (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "param", name }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}

export const ID = Param("id")