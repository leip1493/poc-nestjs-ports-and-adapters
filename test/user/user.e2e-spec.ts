import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { UserIdMother } from '@test/user/domain/UserIdMother';
import { UserMother } from '@test/user/domain/UserMother';

describe('User (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const createUser = async () => {
    const { name, email } = UserMother.create().toPrimitives();
    await request(app.getHttpServer())
      .post('/user')
      .send({ name, email })
      .expect(201);
    return { name, email };
  };

  describe('POST /user', () => {
    it('creates a user that is then listed', async () => {
      const { name, email } = await createUser();

      const { body } = await request(app.getHttpServer())
        .get('/user')
        .expect(200);

      expect(body).toEqual([expect.objectContaining({ name, email })]);
    });

    it.each([
      { case: 'invalid email', body: { name: 'Ada', email: 'invalid' } },
      { case: 'blank name', body: { name: '  ', email: 'ada@example.com' } },
      { case: 'missing name', body: { email: 'ada@example.com' } },
      {
        case: 'non-string name',
        body: { name: 123, email: 'ada@example.com' },
      },
      {
        case: 'non-string email',
        body: { name: 'Ada', email: ['ada@example.com'] },
      },
    ])('returns 400 for $case', ({ body }) => {
      return request(app.getHttpServer()).post('/user').send(body).expect(400);
    });
  });

  describe('GET /user/:id', () => {
    it('returns an existing user', async () => {
      const { name, email } = await createUser();
      const {
        body: [created],
      } = await request(app.getHttpServer()).get('/user');

      await request(app.getHttpServer())
        .get(`/user/${created.id}`)
        .expect(200)
        .expect({ id: created.id, name, email });
    });

    it('returns 404 for an unknown user', () => {
      return request(app.getHttpServer())
        .get(`/user/${UserIdMother.create().value}`)
        .expect(404);
    });

    it('returns 400 for an invalid id', () => {
      return request(app.getHttpServer()).get('/user/invalid').expect(400);
    });
  });
});
