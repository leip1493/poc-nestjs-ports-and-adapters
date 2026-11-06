<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>  
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7pFog-jh7-T4VXWO84RPFAZCZI0UZc9KyQ&usqp=CAU" width="200" alt="Ports and adapters" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

This repository serves as a proof of concept for implementing the Ports and Adapters (Hexagonal) architecture pattern using NestJS. The structure emphasizes a clear separation between application logic and external dependencies, promoting maintainability and testability.


## Requirements

- Node.js 24 (`nvm use`)

## Installation

```bash
$ npm install
```

## Running the app
Running Locally
- Using Docker
Development, with hot reload (`Dockerfile.dev`):
```bash
docker compose up
```

The source code is mounted into the container and `npm run start:dev` recompiles and restarts on every change (a few seconds, it uses polling so it also works on Windows/macOS).
Rebuild only when `package.json` changes:
```bash
docker compose up --build --renew-anon-volumes
```

Production image (`Dockerfile`):
```bash
docker build -t poc-nestjs-ports-and-adapters .
docker run -p 3000:3000 poc-nestjs-ports-and-adapters
```

Both start the NestJS application with an in-memory SQLite database (better-sqlite3).
Access the application at http://localhost:3000 (Swagger UI at http://localhost:3000/api)

- Without Docker
If you prefer not to use Docker, you can run the application locally with the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Folder structure
```
.
├── src
│   ├── user
│   │   ├── domain
│   │   │   ├── UserRepository.ts
│   │   │   └── User.ts
│   │   ├── application
│   │   │   ├── get-all-users/ 
│   │   │   └── user-creator
│   │   │       ├── UserCreator.ts
│   │   │       ├── UserCreatorRequest.ts
│   │   │       └── UserCreator.spec.ts     
│   │   └── infrastructure
│   │       ├── dto
│   │       │   └── create-user.dto.ts
│   │       ├── persistence
│   │       │   └── typeorm
│   │       │       ├── TypeormUser.ts
│   │       │       └── TypeormUserRepository.ts        
│   │       ├── user.controller.ts
│   │       ├── user.module.ts
│   │       └── user.service.ts
│   ├── shared
│   │   ├── domain
│   │   │   ├── exceptions/
│   │   │   └── value-objects/
│   │   │       ├── Uuid.ts
│   │   │       └── MongoId.ts
│   │   └── infrastructure
│   │       └── persistence
│   │           ├── typeorm/          
│   │           ├── mongo/
│   │           └── redis/        
│   └── main.ts
└── test
    └── user
        └── domain
            ├── UserMother.ts
            └── UserEmailMother.ts
```


## Path aliases

Two generic aliases, defined once in `tsconfig.json` (`paths`), work for any new module without extra config:

| Alias | Points to | Example |
|---|---|---|
| `@/*` | `src/*` | `import { User } from '@/user/domain/User';` |
| `@test/*` | `test/*` | `import { UserMother } from '@test/user/domain/UserMother';` |

Same-folder imports stay relative (`./UserCreatorRequest`). `nest build` rewrites the aliases to relative paths in `dist`, and Jest maps them in `jest.config.js` / `test/jest-e2e.json`.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
