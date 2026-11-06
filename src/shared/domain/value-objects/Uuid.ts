import { randomUUID } from 'node:crypto';
import { InvalidArgument } from '../exceptions/InvalidArgument';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class Uuid {
  constructor(readonly value: string) {
    this.ensureIsValidUuid(value);
  }

  static random(): Uuid {
    return new Uuid(randomUUID());
  }

  private ensureIsValidUuid(id: string): void {
    if (!UUID_REGEX.test(id)) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
