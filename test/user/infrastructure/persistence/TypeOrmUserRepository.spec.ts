import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteTypeormClient } from '@/shared/infrastructure/persistence/typeorm/SqliteTypeormClient';
import { TypeOrmUserRepository } from '@/user/infrastructure/persistence/TypeOrmUserRepository';
import { TypeOrmUser } from '@/user/infrastructure/persistence/typeorm/TypeOrmUser';
import { UserIdMother } from '@test/user/domain/UserIdMother';
import { UserMother } from '@test/user/domain/UserMother';

// Integration test: the adapter against a real (in-memory) database.
describe('TypeOrmUserRepository', () => {
  let module: TestingModule;
  let repository: TypeOrmUserRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        SqliteTypeormClient.create(),
        TypeOrmModule.forFeature([TypeOrmUser]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repository = module.get(TypeOrmUserRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('returns an empty list when there are no users', async () => {
    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it('returns the saved users as domain entities', async () => {
    const users = [UserMother.create(), UserMother.create()];

    for (const user of users) await repository.save(user);

    const saved = await repository.getAll();
    expect(saved).toHaveLength(2);
    expect(saved).toEqual(expect.arrayContaining(users));
  });

  it('finds a saved user by id', async () => {
    const user = UserMother.create();
    await repository.save(user);

    await expect(repository.search(user.id)).resolves.toEqual(user);
  });

  it('returns null when searching for a user that does not exist', async () => {
    await expect(repository.search(UserIdMother.create())).resolves.toBeNull();
  });
});
