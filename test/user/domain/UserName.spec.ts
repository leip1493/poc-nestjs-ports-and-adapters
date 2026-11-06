import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { UserName } from '@/user/domain/UserName';
import { UserNameMother } from '@test/user/domain/UserNameMother';

describe('UserName', () => {
  it('accepts a valid name', () => {
    expect(() => UserNameMother.create()).not.toThrow();
  });

  it('accepts a single character', () => {
    expect(new UserName('A').value).toBe('A');
  });

  it.each(['', '   '])('rejects a blank name ("%s")', (name) => {
    expect(() => new UserName(name)).toThrow(InvalidArgument);
  });

  // values come from untyped HTTP bodies at runtime
  it.each([123, null, undefined, ['Ada']])(
    'rejects a non-string (%p)',
    (name) => {
      expect(() => new UserName(name as unknown as string)).toThrow(
        InvalidArgument,
      );
    },
  );
});
