import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { UserEmail } from '@/user/domain/UserEmail';
import { UserEmailMother } from '@test/user/domain/UserEmailMother';

describe('UserEmail', () => {
  it('accepts a valid email', () => {
    expect(() => UserEmailMother.create()).not.toThrow();
  });

  it.each([
    'ada@example.company',
    'ada@mail.example.com',
    'ada.lovelace-1@example.io',
  ])('accepts %s', (email) => {
    expect(new UserEmail(email).value).toBe(email);
  });

  it('validates many emails in a row with the same result', () => {
    const emails = Array.from(
      { length: 5 },
      () => UserEmailMother.create().value,
    );

    emails.forEach((email) => expect(() => new UserEmail(email)).not.toThrow());
  });

  it.each([
    '',
    'invalid',
    'ada@',
    '@example.com',
    'ada@example',
    'ada lovelace@example.com',
  ])('rejects "%s"', (email) => {
    expect(() => new UserEmail(email)).toThrow(InvalidArgument);
  });

  // values come from untyped HTTP bodies at runtime
  it.each([123, null, undefined, ['ada@example.com']])(
    'rejects a non-string (%p)',
    (email) => {
      expect(() => new UserEmail(email as unknown as string)).toThrow(
        InvalidArgument,
      );
    },
  );
});
