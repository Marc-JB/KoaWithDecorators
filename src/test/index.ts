import { suite, test, expect } from "@peregrine/test-with-decorators"
import { HttpGet, Path, Controller, createRouter } from "../main/index"
import { Context } from "koa"

interface Pet {
    id: number
    name: string
    kind: string
}

@Controller("pets")
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

@suite
export class MainTests {
    @test
    public testDecorators(): void {
        // Assert
        expect(PetsController).to.have.property("routes")
        expect(PetsController).to.have.property("path")
        const e = PetsController as any
        expect(e.routes).to.be.an.instanceof(Map)
        expect(e.routes).to.have.lengthOf(2)
        expect(e.routes.get("getAllPets")).to.be.not.null
        expect(e.routes.get("getAllPets")).to.have.property("method")
        expect(e.routes.get("getPetById")).to.be.not.null
        expect(e.routes.get("getPetById")).to.have.property("method")
        expect(e.routes.get("getPetById")).to.have.property("path")
    }

    @test
    public testRouterCreation(): void {
        // Arrange
        const instance = new PetsController(myPets)

        // Act
        const petsRouter = createRouter(instance)

        // Assert
        expect(petsRouter.stack).to.have.lengthOf(2)
        const s = petsRouter.stack.map(it => `${it.methods.join(", ")} - ${it.path}`)
        expect(s).to.include("HEAD, GET - /pets")
        expect(s).to.include("HEAD, GET - /pets/:id")
    }
}
