<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Proof of concept implementing port and adapter architecture using nestjs

## Installation

```bash
$ npm install
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

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

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
