import { MockProxy, mock } from 'jest-mock-extended';
import { InvalidArgument } from '@/shared/domain/exceptions/InvalidArgument';
import { UserMother } from '@test/user/domain/UserMother';
import { UserRepository } from '@/user/domain/UserRepository';
import { UserCreator } from './UserCreator';
import { UserCreatorRequest } from './UserCreatorRequest';

describe('UserCreator', () => {
  let mockRepository: MockProxy<UserRepository>;
  let SUT: UserCreator;

  beforeEach(() => {
    mockRepository = mock();
    SUT = new UserCreator(mockRepository);
  });

  it('create a user without throwing errors when all data is valid', async () => {
    const user = UserMother.create();

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
    };

    await expect(SUT.execute(request)).resolves.not.toThrow();
    expect(mockRepository.save).toHaveBeenCalledWith(
      UserMother.create(request),
    );
  });

  it('throws an error when creating a user with an invalid uuid', async () => {
    const user = UserMother.create();

    const invalidId = 'invalid';

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      id: invalidId,
    };

    await expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error when creating a user with an invalid name', async () => {
    const user = UserMother.create();

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      name: '',
    };

    await expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error when creating a user with an invalid email', async () => {
    const user = UserMother.create();

    const invalidEmail = 'invalid';

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      email: invalidEmail,
    };

    await expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
