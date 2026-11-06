import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/domain/User';
import { UserId } from '@/user/domain/UserId';
import { UserRepository } from '@/user/domain/UserRepository';
import { TypeOrmUser } from './typeorm/TypeOrmUser';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly repository: Repository<TypeOrmUser>,
  ) {}

  async save(user: User): Promise<void> {
    await this.repository.save(this.repository.create(user.toPrimitives()));
  }

  async getAll(): Promise<User[]> {
    const rows = await this.repository.find();
    return rows.map((row) => User.fromPrimitives(row));
  }

  async search(id: UserId): Promise<User | null> {
    const row = await this.repository.findOneBy({ id: id.value });
    return row ? User.fromPrimitives(row) : null;
  }
}
