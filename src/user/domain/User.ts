import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserName } from './UserName';

export class User {
  constructor(
    readonly id: UserId,
    readonly name: UserName,
    readonly email: UserEmail,
  ) {}

  static create(params: { id: string; name: string; email: string }) {
    return new User(
      new UserId(params.id),
      new UserName(params.name),
      new UserEmail(params.email),
    );
  }

  static fromPrimitives(data: { id: string; name: string; email: string }) {
    return new User(
      new UserId(data.id),
      new UserName(data.name),
      new UserEmail(data.email),
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
    };
  }
}
