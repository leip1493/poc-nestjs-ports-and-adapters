import { UserId } from '@/user/domain/UserId';

export class UserIdMother {
  static create(value?: string): UserId {
    return new UserId(value ?? UserId.random().value);
  }
}
