import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCreator } from '@/user/application/user-creator/UserCreator';
import { UserRepository } from '@/user/domain/UserRepository';
import { TypeOrmUserRepository } from './persistence/TypeOrmUserRepository';
import { TypeOrmUser } from './persistence/typeorm/TypeOrmUser';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GetAllUsers } from '@/user/application/get-all-users/GetAllUsers';

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
