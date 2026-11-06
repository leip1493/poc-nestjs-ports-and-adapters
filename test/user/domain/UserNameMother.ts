import { faker } from '@faker-js/faker/locale/en';
import { UserName } from '@/user/domain/UserName';

export class UserNameMother {
  static create(value?: string): UserName {
    return new UserName(value ?? faker.person.firstName());
  }
}
