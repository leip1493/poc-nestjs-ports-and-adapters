import { User } from 'src/user/domain/User';
import { UserNameMother } from './UserNameMother';
import { UserEmailMother } from './UserEmailMother';
import { UserIdMother } from './UserIdMother';

interface UserParams {
  id: string;
  email: string;
  name: string;
}

export class UserMother {
  static create(params?: Partial<UserParams>): User {
    const defaultParams: UserParams = {
      id: UserIdMother.create().value,
      email: UserEmailMother.create().value,
      name: UserNameMother.create().value,
      ...params,
    };

    return User.fromPrimitives(defaultParams);
  }
}
