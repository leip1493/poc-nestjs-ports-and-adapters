import { InvalidArgument } from 'src/shared/domain/exceptions/InvalidArgument';

export class UserEmail {
  private readonly regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  constructor(readonly value: string) {
    this.ensureEmailIsValid(value);
  }

  private ensureEmailIsValid(value: string): void {
    if (!this.regex.test(value)) {
      throw new InvalidArgument(`${value} isn't a valid email`);
    }
  }
}
