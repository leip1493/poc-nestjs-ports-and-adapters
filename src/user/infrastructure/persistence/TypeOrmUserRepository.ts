import { User } from '@/user/domain/User';
import { UserRepository } from '@/user/domain/UserRepository';
import { UserService } from '@/user/infrastructure/user.service';
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
