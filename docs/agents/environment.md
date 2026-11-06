# Environment

Read this when setting up the project, changing dependencies or Docker, or debugging install/runtime errors.

## Stack

- Node.js **24** (`>= 24.15` recommended: `@nestjs/schematics` requires it)
- NestJS 12 (packages are ESM-only; this project is CommonJS and loads them through `require(esm)`)
- TypeScript 6 (not 7: the Swagger CLI plugin and ts-jest don't support it yet)
- TypeORM 1 + `better-sqlite3`, in-memory database (`:memory:`, `synchronize: true`)
- `@nestjs/swagger` with the CLI plugin (`nest-cli.json`): DTO properties are documented automatically
- Jest 30 + ts-jest, `jest-mock-extended`, `@faker-js/faker`, supertest
- oxlint (type-aware) for linting, Prettier for formatting

NestJS 12 is likely newer than your training data. Its docs are indexed at https://docs.nestjs.com/llms.txt. Check Nest's first-party packages (`@nestjs/config`, `@nestjs/terminus`, `@nestjs/throttler`, ...) before adding a third-party library.

## Scripts

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
- `request returned Internal Server Error for API route ... dockerDesktopLinuxEngine` on any `docker` command: Docker Desktop's engine is hung, not the project. Restart Docker Desktop (or `wsl --shutdown` and reopen it).
