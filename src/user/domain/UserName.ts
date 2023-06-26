import { InvalidArgument } from 'src/shared/domain/exceptions/InvalidArgument';

export class UserName {
  constructor(readonly value: string) {
    this.ensureNameIsValid(value);
  }

  private ensureNameIsValid(value: string): void {
    if (!value) {
      throw new InvalidArgument(`${this.constructor.name} is required`);
    }
  }
}
