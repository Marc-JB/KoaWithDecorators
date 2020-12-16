import { Endpoint, Route, FunctionKeys } from "../types"

export function addRouteMetadataToEndpoint<T extends new (...args: any[]) => Object, K extends keyof Route>(
    key: K, 
    data: Route[typeof key], 
    endpoint: Endpoint<T>,
    id: FunctionKeys<T>, 
): void {
    const routes = endpoint.routes ?? new Map<FunctionKeys<T>, Route>()

    const route = routes.get(id) ?? {}
    route[key] = data
    routes.set(id, route)

    endpoint.routes = routes
}
