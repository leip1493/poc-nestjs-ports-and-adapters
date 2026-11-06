# Conventions

Read this before writing or reviewing code.

## Imports and path aliases

| Alias | Points to |
|---|---|
| `@/*` | `src/*` |
| `@test/*` | `test/*` |

- Use an alias for anything outside the current folder: `import { User } from '@/user/domain/User';`.
- Same-folder imports stay relative: `import { UserCreatorRequest } from './UserCreatorRequest';`.
- Don't use `../`, and don't add per-module aliases.
- The aliases are defined in `tsconfig.json` (`paths`) and mirrored in `jest.config.js` and `test/jest-e2e.json`. `nest build` rewrites them to relative paths in `dist/`.

## Naming

- Domain and application classes use `PascalCase.ts` file names (`UserCreator.ts`, `UserEmail.ts`).
- Nest infrastructure files use Nest's `kebab-case` style (`user.controller.ts`, `create-user.dto.ts`).
- Persistence adapters and entities are prefixed by technology (`TypeOrmUserRepository`, `TypeOrmUser`).

## TypeScript

- `strict: true` (except `strictPropertyInitialization`, for DTOs and ORM entities). Keep it compiling without `any` unless a framework boundary forces it.
- Promises must be awaited or explicitly `void`ed (`typescript/no-floating-promises` is an error).
