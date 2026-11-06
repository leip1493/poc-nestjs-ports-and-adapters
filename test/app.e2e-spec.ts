import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

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
    await request(app.getHttpServer())
      .post('/user')
      .send({ name: 'Ada', email: 'ada@example.com' })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .get('/user')
      .expect(200);

    expect(body).toEqual([
      expect.objectContaining({ name: 'Ada', email: 'ada@example.com' }),
    ]);
  });
});
