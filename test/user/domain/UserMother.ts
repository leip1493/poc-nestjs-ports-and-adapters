import { User, UserPrimitives } from '@/user/domain/User';
import { UserNameMother } from './UserNameMother';
import { UserEmailMother } from './UserEmailMother';
import { UserIdMother } from './UserIdMother';

export class UserMother {
  static create(params?: Partial<UserPrimitives>): User {
    return User.fromPrimitives({
      id: UserIdMother.create().value,
      email: UserEmailMother.create().value,
      name: UserNameMother.create().value,
      ...params,
    });
  }
}
