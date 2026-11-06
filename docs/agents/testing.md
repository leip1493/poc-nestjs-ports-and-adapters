# Testing

Read this before writing or changing tests. The process to follow is in [tdd.md](tdd.md).

## Rules

1. **`test/` mirrors `src/`.** Every test lives in `test/`, at the same path as the code it tests: `src/user/application/user-creator/UserCreator.ts` → `test/user/application/user-creator/UserCreator.spec.ts`.
2. **No test code in `src/`.** No specs, Mothers, fixtures or test helpers, and no imports of `@test/*`, `@nestjs/testing`, `@faker-js/faker`, `jest-mock-extended` or `supertest`. `npm run lint` fails on those imports (`no-restricted-imports` in `.oxlintrc.json`), Jest only runs `test/**/*.spec.ts`, and `nest generate` doesn't create spec files (`generateOptions.spec: false` in `nest-cli.json`).
3. **Test data comes from Object Mothers.** Never build domain objects by hand in a test.

## What to test at each layer

| Layer | Test | Example |
|---|---|---|
| Domain | Value objects and entities: valid values, every invalid value, boundaries. No mocks. | `test/user/domain/UserEmail.spec.ts` |
| Application | Use cases with mocked ports: happy path, each failure, what must not happen. | `test/user/application/user-finder/UserFinder.spec.ts` |
| Infrastructure | Adapters against a real in-memory database (integration). | `test/user/infrastructure/persistence/TypeOrmUserRepository.spec.ts` |
| HTTP | e2e through the full `AppModule`: routes and status codes. | `test/app.e2e-spec.ts` |

## How

- **Object Mothers** (`test/<module>/domain/<Name>Mother.ts`) build valid domain objects with faker. There is one per entity and per value object, each with a `static create(...)` that takes optional overrides (`UserMother.create({ name: '' })`). Composite Mothers reuse the smaller ones (`UserMother` uses `UserIdMother`, `UserNameMother` and `UserEmailMother`). To test an invalid case, override only the field under test.
- **Ports are mocked with `jest-mock-extended`** (`mock<UserRepository>()`): Mothers provide the data, the mock provides the port's behaviour. Instantiate the system under test directly; don't use the Nest testing module for use cases.
- Import the code under test through the alias (`@/user/application/...`) and Mothers through `@test/...`.
- **Always `await`** async assertions: `await expect(promise).resolves...` / `.rejects...`. Without the `await`, the test passes even when it should fail.
- Use `toHaveBeenCalledWith`, not `toBeCalledWith` (removed in Jest 30).
- **Adapter integration tests** build a Nest testing module with `SqliteTypeormClient.create()`, `TypeOrmModule.forFeature([...])` and the adapter, and `close()` it in `afterEach`.
- **e2e tests** (`test/*.e2e-spec.ts`) boot the full `AppModule` against in-memory SQLite, take their data from Mothers too, and must `app.close()` in `afterEach`.
- Every new use case needs unit tests for the happy path and for each validation failure.
