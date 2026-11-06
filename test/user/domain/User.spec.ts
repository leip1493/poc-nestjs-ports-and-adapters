import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { User } from '@/user/domain/User';
import { UserMother } from '@test/user/domain/UserMother';

describe('User', () => {
  it('creates a user from valid data', () => {
    const primitives = UserMother.create().toPrimitives();

    expect(User.create(primitives).toPrimitives()).toEqual(primitives);
  });

  it('rebuilds the same user from its primitives', () => {
    const user = UserMother.create();

    expect(User.fromPrimitives(user.toPrimitives())).toEqual(user);
  });

  it.each([
    { field: 'id', value: 'invalid' },
    { field: 'name', value: '' },
    { field: 'email', value: 'invalid' },
  ])('does not create a user with an invalid $field', ({ field, value }) => {
    const primitives = {
      ...UserMother.create().toPrimitives(),
      [field]: value,
    };

    expect(() => User.create(primitives)).toThrow(InvalidArgument);
  });
});
