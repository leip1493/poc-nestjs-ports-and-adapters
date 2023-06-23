import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreator } from 'src/user/application/user-creator/UserCreator';
import { CreateUserDto } from './dto/create-user.dto';
import { GetAllUsers } from '../application/get-all-users/GetAllUsers';
import { UserId } from '../domain/UserId';

@Controller('user')
export class UserController {
  constructor(
    private readonly userCreator: UserCreator,
    private readonly getAllUsers: GetAllUsers,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userCreator.execute({
      ...createUserDto,
      id: UserId.random().value,
    });
  }

  @Get()
  findAll() {
    return this.getAllUsers.execute();
  }
}
