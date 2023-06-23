import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/User';
import { TypeOrmUser } from './persistence/typeorm/TypeOrmUser';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(TypeOrmUser)
    private usersRepository: Repository<TypeOrmUser>,
  ) {}

  async create(user: User): Promise<void> {
    const dbUser = this.usersRepository.create(user.toPrimitives());
    await this.usersRepository.save(dbUser);
  }

  async findAll() {
    const rawUsers = await this.usersRepository.find();
    return rawUsers.map((rawUser) => User.fromPrimitives(rawUser));
  }
}
