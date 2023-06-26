import { MockProxy, mock } from 'jest-mock-extended';
import { UserMother } from '../../../../test/user/domain/UserMother';
import { UserRepository } from '../../domain/UserRepository';
import { GetAllUsers } from './GetAllUsers';

describe('GetAllUsers', () => {
  let mockRepository: MockProxy<UserRepository>;
  let SUT: GetAllUsers;

  beforeEach(() => {
    mockRepository = mock();
    SUT = new GetAllUsers(mockRepository);
  });

  it('get empty list of users', () => {
    mockRepository.getAll.mockResolvedValue([]);

    expect(SUT.execute()).resolves.toHaveLength(0);
  });

  it('get two user from list', () => {
    mockRepository.getAll.mockResolvedValue([
      UserMother.create(),
      UserMother.create(),
    ]);

    expect(SUT.execute()).resolves.toHaveLength(2);
  });
});
