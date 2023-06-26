import { faker } from '@faker-js/faker/locale/en';
import { UserEmail } from 'src/user/domain/UserEmail';

export class UserEmailMother {
  static create(value?: string): UserEmail {
    return new UserEmail(value ?? faker.internet.email());
  }
}
