import { v4 as uuid, validate } from 'uuid';
import { InvalidArgument } from '../exceptions/InvalidArgument';

export class Uuid {
  constructor(readonly value: string) {
    this.ensureIsValidUuid(value);
  }

  static random(): Uuid {
    return new Uuid(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
