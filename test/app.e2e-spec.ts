import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import dataSource from '../src/config/config';
import { User } from '../src/model/user.entity';
import { users } from './seed/user.seed';
import { Bcrypt } from '../src/utils/bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a app request', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.status).toBe(1);
      });
  });

  it('Data seeding', async () => {
    // sha value of Test@123
    const hash =
      '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e';
    const userSeed = await Promise.all(
      users.map(async (user) => {
        user.password = await Bcrypt.encryptPassword(hash);
        return user;
      }),
    );
    const model = await dataSource.initialize();
    const res = await model
      .getRepository(User)
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(userSeed)
      .execute();
    expect(res).toBeTruthy();
  });
});
import './auth.e2e-spec';
import './user.e2e-spec';
