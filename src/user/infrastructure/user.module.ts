import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCreator } from '../application/user-creator/UserCreator';
import { UserRepository } from '../domain/UserRepository';
import { TypeOrmUserRepository } from './persistence/TypeOrmUserRepository';
import { TypeOrmUser } from './persistence/typeorm/TypeOrmUser';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GetAllUsers } from '../application/get-all-users/GetAllUsers';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmUser])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    UserCreator,
    GetAllUsers,
  ],
})
export class UserModule {}
