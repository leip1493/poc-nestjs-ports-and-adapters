import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/UserRepository';

@Injectable()
export class GetAllUsers {
  constructor(private readonly repository: UserRepository) {}

  async execute() {
    const users = await this.repository.getAll();
    return users.map((user) => user.toPrimitives());
  }
}
