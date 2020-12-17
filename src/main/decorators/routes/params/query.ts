/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { FunctionKeys } from "../../../types"
import { addParameterMetadataToEndpointRoute } from "../../../core/addParameterMetadataToEndpointRoute"

interface QueryParameter {
    (name: string): ((target: Object, propertyKey: string | symbol, parameterIndex: number) => void)
    (target: Object, propertyKey: string | symbol, parameterIndex: number): void
}

export const Query: QueryParameter = (...args: any[]): any => {
    if (args.length === 1 && typeof args[0] === "string") {
        return (target: any, propertyKey: any, parameterIndex: any): any => {
            addParameterMetadataToEndpointRoute(
                { type: "query", name: args[0] }, 
                getEndpoint<ObjectConstructor>(target.constructor), 
                propertyKey as FunctionKeys<ObjectConstructor>,
                parameterIndex
            )
        }
    } else {
        addParameterMetadataToEndpointRoute(
            { type: "queries" }, 
            getEndpoint<ObjectConstructor>(args[0].constructor), 
            args[1] as FunctionKeys<ObjectConstructor>,
            args[2]
        )
    }
}
