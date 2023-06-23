import { Uuid } from 'src/shared/domain/value-objects/Uuid';

export class UserId extends Uuid {
  constructor(readonly value: string) {
    super(value);
  }
}
