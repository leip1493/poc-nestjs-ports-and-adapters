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
});
