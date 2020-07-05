[![Node.js linter & tests](https://github.com/Marc-JB/KoaWithDecorators/workflows/Node.js%20linter%20&%20tests/badge.svg)](https://github.com/Marc-JB/KoaWithDecorators/actions)
[![Node.js deployment](https://github.com/Marc-JB/KoaWithDecorators/workflows/Node.js%20deployment/badge.svg)](https://github.com/Marc-JB/KoaWithDecorators/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Marc-JB_KoaWithDecorators&metric=alert_status)](https://sonarcloud.io/dashboard?id=Marc-JB_KoaWithDecorators)
[![license](https://badgen.net/github/license/Marc-JB/KoaWithDecorators?color=cyan)](https://github.com/Marc-JB/KoaWithDecorators/blob/main/LICENSE)
[![npm](https://badgen.net/badge/icon/npm?icon=npm&color=cyan&label)](https://www.npmjs.com/package/@peregrine/koa-with-decorators)
![node version](https://badgen.net/npm/node/@peregrine/koa-with-decorators)
![types](https://badgen.net/npm/types/@peregrine/koa-with-decorators?icon=typescript)
# Koa with decorators
Experimental library for using Koa with decorators

## Notes
* Make sure to enable the `experimentalDecorators` (and preferably `emitDecoratorMetadata`) flag(s) in your `tsconfig.json`
* Add `@types/koa__router` in your `devDependencies` when using Typescript

## Demo
```TypeScript
import { HttpGet, Path, Endpoint, createRouter } from "@peregrine/koa-with-decorators"
import Koa, { Context } from "koa"
import Router from "@koa/router"

interface Pet {
    id: number
    name: string
    kind: string
}

@Endpoint("pets")
class PetsController {
    public constructor(private readonly petsList: Pet[]) {}

    @HttpGet
    public getAllPets(ctx: Context): void {
        ctx.response.status = 200
        ctx.response.body = JSON.stringify(this.petsList, undefined, 4)
    }

    @HttpGet
    @Path("/:id")
    public getPetById(ctx: Context): void {
        const { id } = ctx.params
        const pet = this.petsList.find(it => it.id == parseInt(id)) ?? null
        ctx.response.status = pet === null ? 404 : 200
        if (pet !== null) ctx.response.body = JSON.stringify(pet, undefined, 4)
    }
}

const myPets: Pet[] = [{ id: 1, name: "Maya", kind: "Macaw" }]

const petsRouter: Router = createRouter(PetsController, new PetsController(myPets))

const koa = new Koa()
koa.use(petsRouter.routes())
koa.use(petsRouter.allowedMethods())
koa.listen(8080)
```