<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>  
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF7pFog-jh7-T4VXWO84RPFAZCZI0UZc9KyQ&usqp=CAU" width="200" alt="Ports and adapters" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

## Description

This repository serves as a proof of concept for implementing the Ports and Adapters (Hexagonal) architecture pattern using NestJS. The structure emphasizes a clear separation between application logic and external dependencies, promoting maintainability and testability.


## Installation

```bash
$ npm install
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
