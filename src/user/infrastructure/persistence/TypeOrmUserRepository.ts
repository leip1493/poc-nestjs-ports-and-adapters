import { User } from 'src/user/domain/User';
import { UserRepository } from 'src/user/domain/UserRepository';
import { UserService } from '../user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly service: UserService) {}

  async save(user: User): Promise<void> {
    await this.service.create(user);
  }

  getAll(): Promise<User[]> {
    return this.service.findAll();
  }
}
