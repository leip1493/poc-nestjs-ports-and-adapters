import { MockProxy, mock } from 'jest-mock-extended';
import { UserMother } from '@test/user/domain/UserMother';
import { UserRepository } from '@/user/domain/UserRepository';
import { GetAllUsers } from '@/user/application/get-all-users/GetAllUsers';

describe('GetAllUsers', () => {
  let mockRepository: MockProxy<UserRepository>;
  let SUT: GetAllUsers;

  beforeEach(() => {
    mockRepository = mock();
    SUT = new GetAllUsers(mockRepository);
  });

  it('get empty list of users', async () => {
    mockRepository.getAll.mockResolvedValue([]);

    await expect(SUT.execute()).resolves.toHaveLength(0);
  });

  it('get two user from list', async () => {
    mockRepository.getAll.mockResolvedValue([
      UserMother.create(),
      UserMother.create(),
    ]);

    await expect(SUT.execute()).resolves.toHaveLength(2);
  });
});
