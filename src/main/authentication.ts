import { Request } from "koa"

export interface AuthenticationType {
    readonly type: string
}

export class BearerToken implements AuthenticationType {
    public readonly type = "bearer"

    public constructor(
        public readonly token: string
    ) {}
}

export class BasicAuth implements AuthenticationType {
    public readonly type = "basic"

    public username: string

    public password: string

    public constructor(
        base64EncodedString: string
    ) {
        const decodedString = Buffer.from(base64EncodedString, "base64").toString()
        const splittedString = /^([^:]*):(.*)$/.exec(decodedString)
        if (splittedString === null)
            throw new Error("Could not parse basic authentication string")
        this.username = splittedString[1]
        this.password = splittedString[2]
    }
}

export type AuthenticationProvider<T extends AuthenticationType> = (request: Request) => T | null 