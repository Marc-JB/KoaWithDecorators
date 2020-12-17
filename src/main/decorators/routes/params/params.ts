/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

export const Params: ParameterDecorator = (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "params" }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}
