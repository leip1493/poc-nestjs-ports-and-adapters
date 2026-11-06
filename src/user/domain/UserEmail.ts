import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';

// No `g` flag: a global regex keeps `lastIndex` between `test()` calls.
const EMAIL_REGEX = /^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/;

export class UserEmail {
  constructor(readonly value: string) {
    this.ensureEmailIsValid(value);
  }

  private ensureEmailIsValid(value: string): void {
    if (typeof value !== 'string' || !EMAIL_REGEX.test(value)) {
      throw new InvalidArgument(`${value} isn't a valid email`);
    }
  }
}
