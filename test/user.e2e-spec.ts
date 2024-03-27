import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('Users', () => {
  let app: INestApplication;
  let jwt;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            return {
              secret: config.get<string>('JWT_SECRET'),
              signOptions: { expiresIn: '1d' },
            };
          },
        }),
      ],
      providers: [JwtService],
    }).compile();
    app = moduleFixture.createNestApplication();
    jwt = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  describe('List Users Account', () => {
    try {
      let token;
      it('As a admin, I should validate and login', () => {
        const loginUser = {
          email: 'super@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(loginUser)
          .then((res) => {
            token = res.body.data.token;
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(201);
            expect(res.body.data).toBeTruthy();
          });
      });

      it('As a admin, I should validate token is passed', () => {
        return request(app.getHttpServer())
          .get('/user')
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(403);
          });
      });

      it('As a admin, I should validate token is valid', () => {
        return request(app.getHttpServer())
          .get('/user')
          .set({ Authorization: 'token' })
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(403);
          });
      });

      it('As a admin, I should validate token is valid and contains email id', async () => {
        const token = await jwt.signAsync({
          id: 'user',
        });
        return request(app.getHttpServer())
          .get('/user')
          .set({ Authorization: token })
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(403);
          });
      });

      it('As a admin, I should validate token is valid and contains valid email', async () => {
        const token = await jwt.signAsync({
          email: 'no@example.com',
        });
        return request(app.getHttpServer())
          .get('/user')
          .set({ Authorization: token })
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(403);
          });
      });

      it('As a admin, I should able to list users', () => {
        return request(app.getHttpServer())
          .get('/user')
          .set({ Authorization: token })
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toBeTruthy();
          });
      });
    } catch (exception) {
      console.error(exception);
    }
  });
});
