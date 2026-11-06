import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';

export class UserName {
  constructor(readonly value: string) {
    this.ensureNameIsValid(value);
  }

  private ensureNameIsValid(value: string): void {
    if (!value?.trim()) {
      throw new InvalidArgument(`${this.constructor.name} is required`);
    }
  }
}
