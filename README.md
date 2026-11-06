<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS · Ports and Adapters template

A starting point for NestJS services built with the Ports and Adapters (Hexagonal) architecture: domain logic is isolated from frameworks and infrastructure, and every layer is tested.

**Stack:** Node.js 24 · NestJS 12 · TypeScript 6 · TypeORM 1 + SQLite (in memory) · Jest 30 · oxlint · Docker

## Start a new project from this template

1. Copy the repository without its history: use **Use this template** on GitHub, or `npx degit leip1493/poc-nestjs-ports-and-adapters my-service`.
2. Set `name`, `description`, `author` and `license` in `package.json`, and replace `LICENSE` with your project's own.
3. Install and check that everything passes:
   ```bash
   nvm use 24        # Node >= 24.15 (nvm-windows: nvm use 24)
   npm install
   npm test && npm run test:e2e && npm run lint
   ```
4. Use the `user` module as the reference for your own modules: [docs/agents/architecture.md](docs/agents/architecture.md#adding-a-new-module-example-product).

## Running the app

| | Command | Notes |
|---|---|---|
| Docker, development | `docker compose up` | Hot reload. Source is mounted into the container. After changing `package.json`: `docker compose up --build --renew-anon-volumes` |
| Docker, production | `docker build -t my-service . && docker run -p 3000:3000 my-service` | Multi-stage image, no dev dependencies |
| Local | `npm run start:dev` | Watch mode. `npm run start:prod` runs the build in `dist/` |

The app runs on http://localhost:3000 (`PORT` changes it). Swagger UI: http://localhost:3000/api.

### Endpoints

| Method | Path | Result |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/user` | Creates a user `{ name, email }`. 400 if invalid |
| `GET` | `/user` | Lists users |
| `GET` | `/user/:id` | Finds a user. 400 if the id is not a UUID, 404 if it doesn't exist |

## Architecture

```
src/
├── user/                         # one folder per module (bounded context)
│   ├── domain/                   # entity, value objects, port (UserRepository), UserNotFound
│   ├── application/              # use cases: user-creator/, get-all-users/, user-finder/
│   └── infrastructure/           # Nest module, controller, DTOs, persistence/ (TypeORM adapter)
├── shared/
│   ├── domain/                   # base exceptions (InvalidArgument, NotFound), Uuid
│   └── infrastructure/           # exception filter (domain errors -> HTTP), DB client
├── app.module.ts
└── main.ts
test/                             # mirror of src/: every test lives here
├── user/
│   ├── domain/                   # Object Mothers + entity and value object specs
│   ├── application/              # use case specs (ports mocked)
│   ├── infrastructure/           # adapter integration specs (real in-memory DB)
│   └── user.e2e-spec.ts          # HTTP e2e for the module
├── shared/
└── app.e2e-spec.ts               # app-level e2e
```

- Dependencies point inwards: `infrastructure -> application -> domain`.
- `src/` contains production code only: no specs, Object Mothers or test libraries (`npm run lint` enforces it).
- Imports use two generic aliases: `@/*` -> `src/*` and `@test/*` -> `test/*`.

## Tests

```bash
npm test            # unit + integration (test/**/*.spec.ts)
npm run test:e2e    # e2e (test/**/*.e2e-spec.ts)
npm run test:cov    # coverage
```

Features are built test-first (TDD).

## Working with AI agents

Rules and context for coding agents live in [AGENTS.md](AGENTS.md) (Claude Code reads it through `CLAUDE.md`). It is a short index: the detail is in [docs/agents/](docs/agents/), loaded only when a task needs it.

## License

[MIT](LICENSE)
