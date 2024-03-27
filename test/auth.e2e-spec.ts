import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as moment from 'moment';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import dataSource from '../src/config/config';
import { User } from '../src/model/user.entity';

describe('Authentication', () => {
  let app: INestApplication;
  const trueDataStatus = 1;
  let validRegistration;
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
  describe('Signup', () => {
    try {
      it('As a user I should validate if email is already registered and password is incorrect.', () => {
        const registerUser = {
          email: 'super@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267d',
          firstName: 'super',
          lastName: 'mail',
          userType: 1,
          otp: '123456',
        };
        validRegistration = registerUser;
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(registerUser)
          .then((res) => {
            expect(res.body.statusCode).toBeTruthy();
            expect(res.statusCode).toBe(400);
          });
      });

      it('As a user I should register as user', () => {
        const registerUser = {
          email: 'john@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
          firstName: 'john',
          lastName: 'mail',
          userType: 1,
          otp: '123456',
        };
        validRegistration = registerUser;
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(registerUser)
          .expect(201)
          .then((res) => {
            const { id, email } = res.body.data;
            expect(id).toBeDefined();
            expect(email).toEqual(email);
          });
      });

      it('As a user I should validate if email is already registered but not verified', () => {
        const registerUser = {
          email: 'john@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
          firstName: 'john',
          lastName: 'mail',
          userType: 1,
        };
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(registerUser)
          .then((res) => {
            expect(res.body.statusCode).toBeTruthy();
            expect(res.statusCode).toBe(400);
          });
      });

      it('As a user I should validate if email is already registered and login', () => {
        const registerUser = {
          email: 'super@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
          firstName: 'super',
          lastName: 'mail',
          userType: 1,
        };
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(registerUser)
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.body.data.token).toBeDefined();
          });
      });
    } catch (error) {
      console.error(error);
    }
  });

  describe('Verify Account', () => {
    try {
      it('As a user, I should verify existing user with otp', () => {
        return request(app.getHttpServer())
          .post('/auth/verify-account')
          .send({ email: validRegistration.email, otp: validRegistration.otp })
          .then((res) => {
            expect(res.body.data).toBeTruthy();
            expect(res.statusCode).toBe(201);
          });
      });

      it('As a user, I should check if otp is valid', () => {
        return request(app.getHttpServer())
          .post('/auth/verify-account')
          .send({ email: validRegistration.email, otp: '111111' })
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(400);
          });
      });
    } catch (exception) {
      console.error(exception);
    }
  });

  describe('Forgot Password', () => {
    try {
      // let dataSource.getRepository(User);
      beforeAll(async () => {
        // const dataSource.getRepository(User) = await dataSource.getRepository(User);
        // dataSource.getRepository(User) = await model.getRepository(User);
      });
      it('As a user I should send forgot password link to user', () => {
        const data = {
          email: 'john@mailinator.com',
        };
        return request(app.getHttpServer())
          .post('/auth/forgot-password')
          .send(data)
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(201);
          });
      });

      it('As a user I should send forgot password link to client', () => {
        const data = {
          email: 'client@mailinator.com',
        };

        return request(app.getHttpServer())
          .post('/auth/forgot-password')
          .send(data)
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(201);
          });
      });

      it('As a user I should not reset password with expired token', async () => {
        const date = moment().add(-1, 'day').utc();
        await dataSource
          .getRepository(User)
          .update(
            { email: 'john@mailinator.com' },
            { reset_expiry_time: date },
          );
        const tokenData = await dataSource.getRepository(User).findOne({
          where: { email: 'john@mailinator.com' },
        });

        const data = {
          token: tokenData.reset_token,
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267d',
        };
        const res = await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send(data);
        expect(res.body).toBeTruthy();
        expect(res.statusCode).toBe(400);
      });

      it('As a user I should validate able to reset password', async () => {
        const date = moment().add(1, 'day').utc();
        await dataSource
          .getRepository(User)
          .update(
            { email: 'john@mailinator.com' },
            { reset_expiry_time: date },
          );
        const tokenData = await dataSource.getRepository(User).findOne({
          where: { email: 'john@mailinator.com' },
        });

        const data = {
          token: tokenData.reset_token,
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
        };

        const res = await request(app.getHttpServer())
          .post('/auth/reset-password')
          .send(data);
        expect(res.body).toBeTruthy();
        expect(res.statusCode).toBe(201);
      });
    } catch (exception) {
      console.error(exception);
    }
  });

  describe('Signin Account', () => {
    try {
      it('As a user, I should validate if email is not registered', () => {
        const loginUser = {
          email: 'john1@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267d',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(loginUser)
          .then((res) => {
            expect(res.body.statusCode).toBeTruthy();
            expect(res.statusCode).toBe(400);
          });
      });

      it('As a user, I should validate if invalid password', () => {
        const loginUser = {
          email: 'super@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267d',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(loginUser)
          .then((res) => {
            expect(res.body.statusCode).toBeTruthy();
            expect(res.statusCode).toBe(400);
          });
      });

      it('As a user, I should validate if valid password but user is not active', () => {
        const loginUser = {
          email: 'inactive@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(loginUser)
          .then((res) => {
            expect(res.body.statusCode).toBeTruthy();
            expect(res.statusCode).toBe(401);
          });
      });

      it('As a user, I should validate and login with correct credentials', () => {
        const loginUser = {
          email: 'user@mailinator.com',
          password:
            '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(loginUser)
          .then((res) => {
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(201);
          });
      });

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
            expect(res.body).toBeTruthy();
            expect(res.statusCode).toBe(201);
            expect(res.body.data).toBeTruthy();
          });
      });
    } catch (exception) {
      console.error(exception);
    }
  });
});
