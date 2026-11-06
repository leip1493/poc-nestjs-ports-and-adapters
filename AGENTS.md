# AGENTS.md

Context and rules for AI agents (and humans) working on this repository.

## What this is

A **template / proof of concept** of the Ports and Adapters (Hexagonal) architecture with NestJS. It is copied as the starting point for real projects, so code here should be **exemplary and minimal**: one clear way of doing each thing, no speculative features.

## Stack

- Node.js **24** (`>= 24.15` recommended: `@nestjs/schematics` requires it)
- NestJS 12 (packages are ESM-only; this project is CommonJS and loads them through `require(esm)`)
- TypeScript 6 (not 7: the Swagger CLI plugin and ts-jest don't support it yet)
- TypeORM 1 + `better-sqlite3`, in-memory database (`:memory:`, `synchronize: true`)
- `@nestjs/swagger` with the CLI plugin (`nest-cli.json`): DTO properties are documented automatically
- Jest 30 + ts-jest, `jest-mock-extended`, `@faker-js/faker`, supertest
- oxlint (type-aware) for linting, Prettier for formatting

NestJS 12 is likely newer than your training data. Its docs are indexed at https://docs.nestjs.com/llms.txt. Check Nest's first-party packages (`@nestjs/config`, `@nestjs/terminus`, `@nestjs/throttler`, ...) before adding a third-party library.

## Commands

```bash
npm run start:dev     # watch mode
npm run build         # nest build -> dist/
npm test              # unit tests (test/**/*.spec.ts)
npm run test:e2e      # e2e tests (test/**/*.e2e-spec.ts)
npm run test:cov      # coverage
npm run lint          # oxlint, reports only (no autofix)
npm run format        # prettier --write
docker compose up     # dev container with hot reload (Dockerfile.dev)
docker build .        # production image (Dockerfile)
```

The Jest scripts run with `node --experimental-vm-modules` (needed to load Nest's ESM packages; requires Node >= 24.9). Run them through the npm scripts, not `npx jest`.

**Before finishing any change:** `npm run build`, `npm test`, `npm run test:e2e` and `npm run lint` must pass (lint: 0 errors).

## Architecture

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

### Dependency rule (do not break it)

`infrastructure -> application -> domain`. Never the other way around.

- **domain**: plain TypeScript. No imports from `@nestjs/*`, `typeorm` or any infrastructure. It may import `@/shared/domain/*`.
- **application**: depends only on domain (entities and ports). The only framework import allowed is `@Injectable()` from `@nestjs/common`.
- **infrastructure**: everything framework-specific (Nest modules, controllers, DTOs, TypeORM entities and repositories).

### Patterns used

- **Value objects** (`UserId`, `UserName`, `UserEmail`) validate in their constructor and throw `InvalidArgument` (`@/shared/domain/exceptions/InvalidArgument`) when the value is invalid. IDs extend `Uuid`, which wraps `crypto.randomUUID()`.
- **Entities** (`User`) are built from value objects and expose `static create(...)`, `static fromPrimitives(...)` and `toPrimitives()`. Persistence and HTTP work with primitives, never with value objects.
- **Ports** are `abstract class`es in `domain/` (`UserRepository`). An abstract class, not an `interface`, because it doubles as the Nest DI token.
- **Adapters** implement the port in `infrastructure/persistence/` and are bound in the module: `{ provide: UserRepository, useClass: TypeOrmUserRepository }`.
- **TypeORM entities** (`TypeOrmUser`) are separate from domain entities and live in `infrastructure/persistence/typeorm/`.
- **Use cases** are `@Injectable()` classes with a single `execute(request)` method, a `<UseCase>Request` interface for their input, and only ports injected.
- **Controllers** map DTOs to use case requests. New IDs are generated at this edge (`UserId.random().value`).
- **Errors**: `AllExceptionsFilter` (registered as `APP_FILTER`) maps `InvalidArgument` to 400, passes `HttpException`s through and turns anything else into 500. Throw domain exceptions from the domain, not `HttpException`s.

### Adding a new module (example: `product`)

1. `src/product/domain/`: `Product.ts`, value objects, `ProductRepository.ts` (abstract class).
2. `src/product/application/<use-case>/`: use case, request interface.
3. `src/product/infrastructure/`: `product.module.ts`, controller, DTOs, `persistence/TypeOrmProductRepository.ts`, `persistence/typeorm/TypeOrmProduct.ts`.
4. Register the module: `TypeOrmModule.forFeature([TypeOrmProduct])` in it, and `ProductModule` in `AppModule.imports`.
5. Tests, mirroring `src/`: Object Mothers in `test/product/domain/`, use case specs in `test/product/application/<use-case>/`.

No config changes are needed: the path aliases already cover new modules.

## Conventions

### Imports and path aliases

| Alias | Points to |
|---|---|
| `@/*` | `src/*` |
| `@test/*` | `test/*` |

- Use an alias for anything outside the current folder: `import { User } from '@/user/domain/User';`.
- Same-folder imports stay relative: `import { UserCreatorRequest } from './UserCreatorRequest';`.
- Don't use `../`, and don't add per-module aliases.
- The aliases are defined in `tsconfig.json` (`paths`) and mirrored in `jest.config.js` and `test/jest-e2e.json`. `nest build` rewrites them to relative paths in `dist/`.

### Naming

- Domain and application classes use `PascalCase.ts` file names (`UserCreator.ts`, `UserEmail.ts`).
- Nest infrastructure files use Nest's `kebab-case` style (`user.controller.ts`, `create-user.dto.ts`).
- Persistence adapters and entities are prefixed by technology (`TypeOrmUserRepository`, `TypeOrmUser`).

### TypeScript

- `strict: true` (except `strictPropertyInitialization`, for DTOs and ORM entities). Keep it compiling without `any` unless a framework boundary forces it.
- Promises must be awaited or explicitly `void`ed (`typescript/no-floating-promises` is an error).

## Testing

### Rules

1. **`test/` mirrors `src/`.** Every test lives in `test/`, at the same path as the code it tests: `src/user/application/user-creator/UserCreator.ts` → `test/user/application/user-creator/UserCreator.spec.ts`.
2. **No test code in `src/`.** No specs, Mothers, fixtures or test helpers, and no imports of `@test/*`, `@nestjs/testing`, `@faker-js/faker`, `jest-mock-extended` or `supertest`. `npm run lint` fails on those imports (`no-restricted-imports` in `.oxlintrc.json`), Jest only runs `test/**/*.spec.ts`, and `nest generate` doesn't create spec files (`generateOptions.spec: false` in `nest-cli.json`).
3. **Test data comes from Object Mothers.** Never build domain objects by hand in a test.

### How

- **Object Mothers** (`test/<module>/domain/<Name>Mother.ts`) build valid domain objects with faker. There is one per entity and per value object, each with a `static create(...)` that takes optional overrides (`UserMother.create({ name: '' })`). Composite Mothers reuse the smaller ones (`UserMother` uses `UserIdMother`, `UserNameMother` and `UserEmailMother`). To test an invalid case, override only the field under test.
- **Ports are mocked with `jest-mock-extended`** (`mock<UserRepository>()`): Mothers provide the data, the mock provides the port's behaviour. Instantiate the system under test directly; don't use the Nest testing module for use cases.
- Import the code under test through the alias (`@/user/application/...`) and Mothers through `@test/...`.
- **Always `await`** async assertions: `await expect(promise).resolves...` / `.rejects...`. Without the `await`, the test passes even when it should fail.
- Use `toHaveBeenCalledWith`, not `toBeCalledWith` (removed in Jest 30).
- **e2e tests** (`test/*.e2e-spec.ts`) boot the full `AppModule` against in-memory SQLite and must `app.close()` in `afterEach`.
- Every new use case needs unit tests for the happy path and for each validation failure.

## Docker

- `Dockerfile`: production. Multi-stage `node:24-alpine`, `npm ci`, build, then prune dev deps. Runs `node dist/main`.
- `Dockerfile.dev` + `docker-compose.yaml`: development. Source is bind-mounted, runs `npm run start:dev`. Keep these settings:
  - `pull_policy: build`, so `up` never reuses a stale image (e.g. an old production build with the same name).
  - An anonymous `/app/node_modules` volume. `better-sqlite3` is native, so the container needs its own Linux build.
  - `TSC_WATCHFILE` / `TSC_WATCHDIRECTORY` set to dynamic polling, because file events don't cross Windows/macOS bind mounts.
- After changing `package.json`: `docker compose up --build --renew-anon-volumes`.

## Known gotchas

- `TypeError: this.sqlite is not a constructor` (TypeORM) or `NODE_MODULE_VERSION` errors mean `better-sqlite3` was compiled for another Node version. Fix: `npm rebuild better-sqlite3`.
- `EBADENGINE` warnings from `@nestjs/schematics` / `@angular-devkit/*`: Node is older than 24.15. They are harmless, but upgrade Node.
- nvm-windows does not read `.nvmrc`; run `nvm use 24` explicitly.
- TypeORM 1 removed the `sqlite` driver: use `type: 'better-sqlite3'`.

## Git

- `master` is the main branch. Work on a branch and open a PR.
- The `pre-ai` branch is a **frozen snapshot** of the handcrafted, pre-AI code. Never commit, rebase or push to it.
