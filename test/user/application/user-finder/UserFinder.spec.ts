import { MockProxy, mock } from 'jest-mock-extended';
import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { UserFinder } from '@/user/application/user-finder/UserFinder';
import { UserNotFound } from '@/user/domain/UserNotFound';
import { UserRepository } from '@/user/domain/UserRepository';
import { UserIdMother } from '@test/user/domain/UserIdMother';
import { UserMother } from '@test/user/domain/UserMother';

describe('UserFinder', () => {
  let repository: MockProxy<UserRepository>;
  let SUT: UserFinder;

  beforeEach(() => {
    repository = mock();
    SUT = new UserFinder(repository);
  });

  it('returns the user when it exists', async () => {
    const user = UserMother.create();
    repository.search.mockResolvedValue(user);

    await expect(SUT.execute({ id: user.id.value })).resolves.toEqual(
      user.toPrimitives(),
    );
    expect(repository.search).toHaveBeenCalledWith(user.id);
  });

  it('throws UserNotFound when the user does not exist', async () => {
    repository.search.mockResolvedValue(null);

    await expect(
      SUT.execute({ id: UserIdMother.create().value }),
    ).rejects.toThrow(UserNotFound);
  });

  it('throws InvalidArgument for an invalid id without querying the repository', async () => {
    await expect(SUT.execute({ id: 'invalid' })).rejects.toThrow(
      InvalidArgument,
    );
    expect(repository.search).not.toHaveBeenCalled();
  });
});
