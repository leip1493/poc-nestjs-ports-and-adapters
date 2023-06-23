import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserCreator } from 'src/user/application/user-creator/UserCreator';
import { GetAllUsers } from '../application/get-all-users/GetAllUsers';
import { UserId } from '../domain/UserId';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserResponseDto } from './dto/find-all-user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userCreator: UserCreator,
    private readonly getAllUsers: GetAllUsers,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userCreator.execute({
      ...createUserDto,
      id: UserId.random().value,
    });
  }

  @Get()
  @ApiOkResponse({ type: [FindAllUserResponseDto] })
  findAll() {
    return this.getAllUsers.execute();
  }
}
