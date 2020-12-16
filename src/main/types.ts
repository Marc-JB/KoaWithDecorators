export interface Route {
    method?: string
    path?: string
    defaultStatusCode?: number | "auto"
    cachedFor?: number
    download?: boolean | string
}

export type ConstructorType<T extends Object> = new (...args: any[]) => T

export type InferConstructorType<T extends new (...args: any[]) => Object> = T extends new (...args: any[]) => infer C ? C : never

export type Endpoint<
    T extends new (...args: any[]) => Object
> = {
    routes?: Map<FunctionKeys<T>, Route>
    path?: string
} & T

export type FunctionKeysInt<
    T extends new (...args: any[]) => Object, 
    R extends InferConstructorType<T>
> = { [K in keyof R]: R[K] extends (...args: any[]) => any ? K : never }[keyof R]

export type FunctionKeys<T extends new (...args: any[]) => Object> = FunctionKeysInt<T, InferConstructorType<T>>