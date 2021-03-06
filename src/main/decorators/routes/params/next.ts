/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

export const Next: ParameterDecorator = (target, propertyKey, parameterIndex): void => {
    addParameterMetadataToEndpointRoute(
        { type: "next" }, 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>,
        parameterIndex
    )
}

export const Nxt = Next