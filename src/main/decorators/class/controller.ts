/* eslint-disable @typescript-eslint/naming-convention */
import { getEndpoint } from "../../core/getEndpoint"

interface ControllerDecoratorType {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    (name: string): (<TFunction extends Function>(target: TFunction) => TFunction | void)

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    <TFunction extends Function>(target: TFunction): TFunction | void
}

export const Controller: ControllerDecoratorType = (nameOrConstructor: any): any => {
    if (typeof nameOrConstructor === "string") {
        return (constructor: any): void => {
            getEndpoint(constructor).path = nameOrConstructor
        }
    } else getEndpoint(nameOrConstructor).path = "/"
}

/** @deprecated use Controller */
export const ApiController = Controller

/** @deprecated use Controller */
export const Endpoint = Controller