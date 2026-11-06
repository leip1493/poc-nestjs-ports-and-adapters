# AGENTS.md

A **template** of the Ports and Adapters (Hexagonal) architecture with NestJS 12, used as the starting point for real projects. Code must be exemplary and minimal: one clear way of doing each thing, no speculative features.

## Always

- **TDD.** Define the behaviour and edge cases first (`it.todo`), see the tests fail, then write the minimum code. → [tdd.md](docs/agents/tdd.md)
- **Dependency rule:** `infrastructure -> application -> domain`, never the other way around. Domain code doesn't import from `@nestjs/*` or `typeorm`. → [architecture.md](docs/agents/architecture.md)
- **Tests live in `test/`, mirroring `src/`.** No test code in `src/`. Test data comes from Object Mothers. → [testing.md](docs/agents/testing.md)
- **Imports:** use `@/*` (src) and `@test/*` (test) for anything outside the current folder. No `../`. → [conventions.md](docs/agents/conventions.md)
- **Before finishing:** `npm run build`, `npm test`, `npm run test:e2e` and `npm run lint` must pass.
- **Git:** work on a branch and open a PR to `master`. The `pre-ai` branch is a frozen snapshot of the pre-AI code: never commit, rebase or push to it.

## Commands

```bash
npm run start:dev   # watch mode
npm test            # unit tests (test/**/*.spec.ts)
npm run test:e2e    # e2e tests
npm run lint        # oxlint (no autofix)
docker compose up   # dev container with hot reload
```

All scripts: [environment.md](docs/agents/environment.md).

## Read when needed

Load only the documents the task needs:

| Read | When |
|---|---|
| [docs/agents/tdd.md](docs/agents/tdd.md) | Starting any feature, use case, value object or bug fix |
| [docs/agents/architecture.md](docs/agents/architecture.md) | Creating or moving files, adding a module, working on domain or application code |
| [docs/agents/testing.md](docs/agents/testing.md) | Writing or changing tests, Object Mothers, mocks |
| [docs/agents/conventions.md](docs/agents/conventions.md) | Writing or reviewing code: aliases, naming, TypeScript rules |
| [docs/agents/environment.md](docs/agents/environment.md) | Stack versions, dependencies, Docker, install or runtime errors |

## Maintaining these docs

New rules go into the matching document in `docs/agents/`, not here. A rule belongs in **Always** only if it applies to every task, and then as a single line that links to its detail. Keep this file short.
