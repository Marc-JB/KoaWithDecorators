/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../../core/getEndpoint"
import { addRouteMetadataToEndpoint } from "../../../core/addRouteMetadataToEndpoint"
import { FunctionKeys } from "../../../types"

interface DownloadDecoratorType {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (filename: string): (<T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void)

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void
}

export const RequestClientDownload: DownloadDecoratorType = (...args: any[]): any => {
    if (args.length === 1 && typeof args[0] === "string") {
        return (target: any, propertyKey: any, _: any): any => {
            addRouteMetadataToEndpoint(
                "download", 
                args[0], 
                getEndpoint<ObjectConstructor>(target.constructor), 
                propertyKey as FunctionKeys<ObjectConstructor>
            )
        }
    } else {
        addRouteMetadataToEndpoint(
            "download", 
            true, 
            getEndpoint<ObjectConstructor>(args[0].constructor), 
            args[1] as FunctionKeys<ObjectConstructor>
        )
    }
}