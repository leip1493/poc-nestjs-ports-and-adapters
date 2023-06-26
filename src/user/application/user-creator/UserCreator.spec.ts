import { MockProxy, mock } from 'jest-mock-extended';
import { InvalidArgument } from 'src/shared/domain/exceptions/InvalidArgument';
import { UserMother } from '../../../../test/user/domain/UserMother';
import { UserRepository } from '../../domain/UserRepository';
import { UserCreator } from './UserCreator';
import { UserCreatorRequest } from './UserCreatorRequest';

describe('UserCreator', () => {
  let mockRepository: MockProxy<UserRepository>;
  let SUT: UserCreator;

  beforeEach(() => {
    mockRepository = mock();
    SUT = new UserCreator(mockRepository);
  });

  it('create a user without throwing errors when all data is valid', () => {
    const user = UserMother.create();

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
    };

    expect(SUT.execute(request)).resolves.not.toThrow();
    expect(mockRepository.save).toBeCalledWith(UserMother.create(request));
  });

  it('throws an error when creating a user with an invalid uuid', () => {
    const user = UserMother.create();

    const invalidId = 'invalid';

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      id: invalidId,
    };

    expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error when creating a user with an invalid name', () => {
    const user = UserMother.create();

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      name: '',
    };

    expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('throws an error when creating a user with an invalid email', () => {
    const user = UserMother.create();

    const invalidEmail = 'invalid';

    const request: UserCreatorRequest = {
      ...user.toPrimitives(),
      email: invalidEmail,
    };

    expect(SUT.execute(request)).rejects.toThrow(InvalidArgument);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
