import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserName } from './UserName';

export interface UserPrimitives {
  id: string;
  name: string;
  email: string;
}

export class User {
  constructor(
    readonly id: UserId,
    readonly name: UserName,
    readonly email: UserEmail,
  ) {}

  /**
   * A brand-new user. Rules or side effects that only apply on creation
   * (e.g. recording a `UserCreated` domain event) belong here.
   */
  static create(params: UserPrimitives): User {
    return User.fromPrimitives(params);
  }

  /** Rebuilds an existing user, e.g. from the database. No creation side effects. */
  static fromPrimitives(data: UserPrimitives): User {
    return new User(
      new UserId(data.id),
      new UserName(data.name),
      new UserEmail(data.email),
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
    };
  }
}
