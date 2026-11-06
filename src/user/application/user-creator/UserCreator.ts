import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';
import { UserCreatorRequest } from './UserCreatorRequest';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserCreator {
  constructor(private readonly repository: UserRepository) {}

  async execute(request: UserCreatorRequest): Promise<void> {
    const user = User.create(request);
    await this.repository.save(user);
  }
}
