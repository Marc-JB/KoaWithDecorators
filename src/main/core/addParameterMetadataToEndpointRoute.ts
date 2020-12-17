import { Endpoint, Route, FunctionKeys, Parameter, IndexableParameter } from "../types"

type InferMapValue<M extends Map<any, any>> = M extends Map<any, infer V> ? V : never

export function addParameterMetadataToEndpointRoute<T extends new (...args: any[]) => Object>(
    param: InferMapValue<NonNullable<Route["params"]>>,
    endpoint: Endpoint<T>,
    id: FunctionKeys<T>,
    index: number
): void {
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    const route = routes.get(id) ?? {}
    const params = route.params ?? new Map<number, Parameter | IndexableParameter>()
    params.set(index, param)
    route.params = params
    routes.set(id, route)

    endpoint.routes = routes
}
