import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@/app.module';
import { UserIdMother } from '@test/user/domain/UserIdMother';
import { UserMother } from '@test/user/domain/UserMother';

describe('AppController (e2e)', () => {
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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Healthy 😁');
  });

  it('/user (POST) then (GET)', async () => {
    const { name, email } = UserMother.create().toPrimitives();

    await request(app.getHttpServer())
      .post('/user')
      .send({ name, email })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get('/user')
      .expect(200);

    expect(body).toEqual([expect.objectContaining({ name, email })]);
  });

  it('/user/:id (GET) returns an existing user', async () => {
    const { name, email } = UserMother.create().toPrimitives();
    await request(app.getHttpServer()).post('/user').send({ name, email });
    const {
      body: [created],
    } = await request(app.getHttpServer()).get('/user');

    await request(app.getHttpServer())
      .get(`/user/${created.id}`)
      .expect(200)
      .expect({ id: created.id, name, email });
  });

  it('/user/:id (GET) returns 404 for an unknown user', () => {
    return request(app.getHttpServer())
      .get(`/user/${UserIdMother.create().value}`)
      .expect(404);
  });

  it('/user/:id (GET) returns 400 for an invalid id', () => {
    return request(app.getHttpServer()).get('/user/invalid').expect(400);
  });
});
