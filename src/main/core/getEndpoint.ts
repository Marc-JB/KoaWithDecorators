import { Endpoint } from "../types"

export function getEndpoint<T extends new (...args: any[]) => Object>(constructor: Function): Endpoint<T> {
    return constructor as unknown as Endpoint<T>
}