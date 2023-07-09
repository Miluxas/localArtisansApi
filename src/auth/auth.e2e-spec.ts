import * as supertest from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';
import {
  IdentityError,
  identityErrorMessages
} from '../identity/identity.error';
import { AuthError, authErrorMessages } from './auth.error';

describe('Auth Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  function userGetUserList() {
    return supertest
      .agent(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  }
  let userTempToken;
  it(' User register ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'new-user@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user@gmail.com',
        );
        expect(resultObject.payload.user.role).toEqual('user');
        expect(resultObject.payload.otpExpires).toHaveLength(24);
        userTempToken = resultObject.payload.token;
      });
  });

  it(' User register throw error on duplicate email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'new-user@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          identityErrorMessages[IdentityError.DUPLICATE_EMAIL].message,
        );
        expect(resultObject.meta.code).toEqual(400);
      });
  });

  it(' User register throw error on invalid email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'admin@gmail',
        password: 'password-string',
        role: 'customer',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error without email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        password: 'password-string',
        role: 'customer',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error without first name', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        lastName: 'test family',
        email: 'admin@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error without last name', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        email: 'admin@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error without email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'admin@gmail.com',
        role: 'customer',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error without role', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'admin@gmail.com',
        password: 'password-string',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User register throw error with invalid role', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'admin@gmail.com',
        password: 'password-string',
        role: 'invalid-role',
      })
      .expect(400)
      .then(checkValidationException);
  });

  it(' User should get exception when get user list by OTP token', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${userTempToken}`)
      .expect(401);
  });

  it(' User verify email by otp code ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/otp-email')
      .set('Authorization', `Bearer ${userTempToken}`)
      .send({
        otp: '123456',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        userToken = resultObject.payload.token;
      });
  });

  it(' User can get user list by token', userGetUserList);

  it(' User get exception on verification with duplicate otp code ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/otp-email')
      .set('Authorization', `Bearer ${userTempToken}`)
      .send({
        otp: '123456',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          authErrorMessages[AuthError.OTP_INVALID].message,
        );
      });
  });

  let userToken;
  it(' User login ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'new-user@gmail.com',
        password: 'password-string',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user@gmail.com',
        );
        userToken = resultObject.payload.token;
      });
  });

  it(' User can get profile ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.email).toEqual('new-user@gmail.com');
      });
  });

  it(' User get error on user list without login', async() => {
    return supertest.agent(app.getHttpServer()).post('/user').expect(401);
  });

  it(' User can get user list ', userGetUserList);

  it(' User login throw error on wrong email ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'not-user@gmail.com',
        password: 'password-string',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          identityErrorMessages[IdentityError.BAD_CREDENTIAL].message,
        );
      });
  });

  it(' User login throw error without email ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'password-string',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });

  it(' User login throw error without password ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'not-user@gmail.com',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });

  it(' User should can request reset password ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({
        email: 'new-user@gmail.com',
      })
      .expect(201);
  });
  let resetPasswordToken;
  it(' User should can verify reset password OTP ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/verify-reset-password-otp')
      .send({
        email: 'new-user@gmail.com',
        otp: '123456',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        resetPasswordToken = resultObject.payload.resetPasswordToken;
      });
  });

  it(' User verify email by otp code ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/reset-password')
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .send({
        password: '123123',
      })
      .expect(201);
  });

  it(' User login with new password', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'new-user@gmail.com',
        password: '123123',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user@gmail.com',
        );
        userToken = resultObject.payload.token;
      });
  });

  it(' User can get user list by new password', userGetUserList);

  it(' User register by unverified email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'new-unverified-user@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-unverified-user@gmail.com',
        );
        expect(resultObject.payload.user.role).toEqual('user');
      });
  });

  it(' User should can request reset password by unverified email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({
        email: 'new-unverified-user@gmail.com',
      })
      .expect(201);
  });

  let resetPasswordTokenForUnverifiedEmail;
  it(' User should can verify reset password OTP by unverified email', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/verify-reset-password-otp')
      .send({
        email: 'new-unverified-user@gmail.com',
        otp: '123456',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        resetPasswordTokenForUnverifiedEmail =
          resultObject.payload.resetPasswordToken;
      });
  });

  it(' User verify unverified email by otp code ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/reset-password')
      .set('Authorization', `Bearer ${resetPasswordTokenForUnverifiedEmail}`)
      .send({
        password: '123123',
      })
      .expect(201);
  });

  it(' User login with new password', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'new-unverified-user@gmail.com',
        password: '123123',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-unverified-user@gmail.com',
        );
        userToken = resultObject.payload.token;
      });
  });

  it(' User logout from system', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  });

  it(' User logout from system again without error', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  });

  it(' User can not get user list after logout', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it(' New user register ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'new-user3@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user3@gmail.com',
        );
        expect(resultObject.payload.user.role).toEqual('user');
        expect(resultObject.payload.otpExpires).toHaveLength(24);
        userTempToken = resultObject.payload.token;
      });
  });

  it(' New user login without email verification ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'new-user3@gmail.com',
        password: 'password-string',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user3@gmail.com',
        );
        expect(resultObject.payload.otpExpires).toHaveLength(24);
        userTempToken = resultObject.payload.token;
      });
  });

  it(' New user verify email by otp code ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/otp-email')
      .set('Authorization', `Bearer ${userTempToken}`)
      .send({
        otp: '123456',
      })
      .expect(201);
  });

  it(' New user login after email verification ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'new-user3@gmail.com',
        password: 'password-string',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual(
          'new-user3@gmail.com',
        );
        userToken = resultObject.payload.token;
      });
  });

  it(' New user can get user list', userGetUserList);

  it(' User can NOT run an api with admin layer access ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/user/admin-layer-access')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});

function checkValidationException(result) {
  const resultObject = JSON.parse(result.text);
  expect(resultObject.meta.message).toEqual('Validation Error');
  expect(resultObject.meta.code).toEqual(400);
}
