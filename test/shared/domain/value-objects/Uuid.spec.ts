import { randomUUID } from 'node:crypto';
import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { Uuid } from '@/shared/domain/value-objects/Uuid';

describe('Uuid', () => {
  it('generates a valid random uuid', () => {
    expect(() => new Uuid(Uuid.random().value)).not.toThrow();
  });

  it('generates a different value each time', () => {
    expect(Uuid.random().value).not.toBe(Uuid.random().value);
  });

  it('accepts a valid uuid in any letter case', () => {
    const value = randomUUID().toUpperCase();

    expect(new Uuid(value).value).toBe(value);
  });

  it.each(['', 'invalid', '123', `${randomUUID()}x`])(
    'rejects "%s"',
    (value) => {
      expect(() => new Uuid(value)).toThrow(InvalidArgument);
    },
  );
});
