# Architecture

Read this before creating or moving files, adding a module, or touching the domain or application layers.

## Folder structure

```
src/
├── <module>/                    # one folder per bounded context (e.g. user/)
│   ├── domain/                  # entities, value objects, ports
│   ├── application/             # use cases, one folder each
│   │   └── <use-case>/          # UseCase.ts, UseCaseRequest.ts
│   └── infrastructure/          # adapters: Nest module, controller, DTOs, persistence
├── shared/
│   ├── domain/                  # base exceptions, shared value objects (Uuid)
│   └── infrastructure/          # global exception filter, DB client
├── app.module.ts                # imports every <module>Module + DB client
└── main.ts                      # bootstrap + Swagger (/api)
test/                            # mirror of src/: same folders, same names
├── <module>/
│   ├── domain/                  # Object Mothers (<Name>Mother.ts)
│   └── application/<use-case>/  # <UseCase>.spec.ts
├── app.controller.spec.ts
└── app.e2e-spec.ts              # e2e tests
```

## Dependency rule (do not break it)

`infrastructure -> application -> domain`. Never the other way around.

- **domain**: plain TypeScript. No imports from `@nestjs/*`, `typeorm` or any infrastructure. It may import `@/shared/domain/*`.
- **application**: depends only on domain (entities and ports). The only framework import allowed is `@Injectable()` from `@nestjs/common`.
- **infrastructure**: everything framework-specific (Nest modules, controllers, DTOs, TypeORM entities and repositories).

## Patterns used

- **Value objects** (`UserId`, `UserName`, `UserEmail`) validate in their constructor and throw `InvalidArgument` (`@/shared/domain/exceptions/InvalidArgument`) when the value is invalid. IDs extend `Uuid`, which wraps `crypto.randomUUID()`.
- **Entities** (`User`) are built from value objects and expose `static create(...)` (a brand-new entity: creation-only rules and domain events go here), `static fromPrimitives(...)` (rebuild an existing one, e.g. from the DB, with no side effects) and `toPrimitives()`, typed with a `<Entity>Primitives` interface. Persistence and HTTP work with primitives, never with value objects.
- **Ports** are `abstract class`es in `domain/` (`UserRepository`). An abstract class, not an `interface`, because it doubles as the Nest DI token.
- **Adapters** implement the port in `infrastructure/persistence/`, use the ORM directly (`@InjectRepository(TypeOrmUser)`, with no intermediate Nest service) and are bound in the module: `{ provide: UserRepository, useClass: TypeOrmUserRepository }`. Lookups that may find nothing return `null` (`search(id)`); the use case decides whether that is an error.
- **TypeORM entities** (`TypeOrmUser`) are separate from domain entities and live in `infrastructure/persistence/typeorm/`.
- **Use cases** are `@Injectable()` classes with a single `execute(request)` method, a `<UseCase>Request` interface for their input, and only ports injected.
- **Controllers** map DTOs to use case requests. New IDs are generated at this edge (`UserId.random().value`).
- **Errors**: domain exceptions extend `@/shared/domain/exceptions/*`: `InvalidArgument` (400) and `NotFound` (404), with module-specific subclasses such as `UserNotFound`. `AllExceptionsFilter` (registered as `APP_FILTER`) maps them, passes `HttpException`s through, and turns anything else into a generic 500, logging the error without exposing its message to the client. Throw domain exceptions from the domain and application layers, never `HttpException`s. A new error category gets a new base class in `shared/domain/exceptions` plus a line in the filter.

## Adding a new module (example: `product`)

Follow the [TDD workflow](tdd.md). Each step starts with its test:

1. **Behaviour.** In `test/product/application/<use-case>/<UseCase>.spec.ts`, list the behaviour and edge cases as `it.todo`.
2. **Domain, test first.** Write the Object Mothers in `test/product/domain/`, then the value object, entity and port tests. Then implement `src/product/domain/`: `Product.ts`, value objects, and `ProductRepository.ts` (an abstract class).
3. **Use case, test first.** Make the use case spec red, then implement `src/product/application/<use-case>/`: the use case and its request interface.
4. **Infrastructure.** Add `src/product/infrastructure/`: `product.module.ts`, controller, DTOs, `persistence/TypeOrmProductRepository.ts` and `persistence/typeorm/TypeOrmProduct.ts`. Cover the HTTP flow with an e2e test in `test/` (written first as well).
5. **Register the module.** Add `TypeOrmModule.forFeature([TypeOrmProduct])` in the module, and `ProductModule` in `AppModule.imports`.

No config changes are needed: the path aliases already cover new modules.
