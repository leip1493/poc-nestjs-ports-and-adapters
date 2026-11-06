import { Injectable } from '@nestjs/common';
import { UserPrimitives } from '@/user/domain/User';
import { UserId } from '@/user/domain/UserId';
import { UserNotFound } from '@/user/domain/UserNotFound';
import { UserRepository } from '@/user/domain/UserRepository';
import { UserFinderRequest } from './UserFinderRequest';

@Injectable()
export class UserFinder {
  constructor(private readonly repository: UserRepository) {}

  async execute(request: UserFinderRequest): Promise<UserPrimitives> {
    const id = new UserId(request.id);
    const user = await this.repository.search(id);

    if (!user) throw new UserNotFound(id);

    return user.toPrimitives();
  }
}
