import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllUsers } from '@/user/application/get-all-users/GetAllUsers';
import { UserCreator } from '@/user/application/user-creator/UserCreator';
import { UserFinder } from '@/user/application/user-finder/UserFinder';
import { UserId } from '@/user/domain/UserId';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userCreator: UserCreator,
    private readonly getAllUsers: GetAllUsers,
    private readonly userFinder: UserFinder,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid name or email.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userCreator.execute({
      ...createUserDto,
      id: UserId.random().value,
    });
  }

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  findAll() {
    return this.getAllUsers.execute();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'The id is not a valid UUID.' })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  findOne(@Param('id') id: string) {
    return this.userFinder.execute({ id });
  }
}
