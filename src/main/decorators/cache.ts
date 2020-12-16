/* eslint-disable @typescript-eslint/naming-convention */
import { addRouteMetadataToEndpoint, getEndpoint } from "../core"
import { FunctionKeys } from "../types"

const timeFactors = {
    seconds: 1,
    minutes: 60,
    hour: 60 * 60,
    days: 24 * 60 * 60,
    weeks: 7 * 24 * 60 * 60
}

export const CachedFor = (time: number, unit: keyof typeof timeFactors): MethodDecorator => (target, propertyKey, _): void => {
    addRouteMetadataToEndpoint(
        "cachedFor", 
        time * timeFactors[unit], 
        getEndpoint<ObjectConstructor>(target.constructor), 
        propertyKey as FunctionKeys<ObjectConstructor>
    )
}