import * as supertest from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';
import { AdminRole } from '../common/admin-role.constant';
import {
  IdentityError,
  identityErrorMessages,
} from '../identity/identity.error';


describe('Auth Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let adminToken;
  it(' Admin login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('admin@gmail.com');
        adminToken = resultObject.payload.token;
      });
  });

  let newAdminResetPasswordToken;
  it(' Admin register new admin', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'new-admin@gmail.com',
        role: AdminRole.FinancialManager,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        newAdminResetPasswordToken = resultObject.payload.resetPasswordToken;
      });
  });

  it(' User can register by admin email', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'test user',
        lastName: 'test family',
        email: 'new-admin@gmail.com',
        password: 'password-string',
        role: 'customer',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('new-admin@gmail.com');
        expect(resultObject.payload.user.role).toEqual('customer');
        expect(resultObject.payload.otpExpires).toHaveLength(24);
      });
  });

  it(' Admin reset password by token ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/reset-password')
      .set('Authorization', `Bearer ${newAdminResetPasswordToken}`)
      .send({
        password: 'new1234567',
      })
      .expect(201);
  });

  it(' New admin login with password', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'new-admin@gmail.com',
        password: 'new1234567',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.role).toEqual(
          AdminRole.FinancialManager,
        );
      });
  });

  it(' Admin can get user list ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);
  });

  it(' Admin can get profile ', () => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/auth/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.email).toEqual('admin@gmail.com');
      });
  });

  it(' Admin login throw error on normal login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          identityErrorMessages[IdentityError.BAD_CREDENTIAL].message,
        );
      });
  });

  it(' Admin can run an api with admin layer access ', () => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/user/admin-layer-access')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  let resetPasswordToken;
  it(' Admin should can request reset password link', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/forgot-password')
      .send({
        email: 'admin@gmail.com',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        resetPasswordToken = resultObject.payload.resetPasswordToken;
      });
  });

  it(' Admin reset password by token ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/reset-password')
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .send({
        password: '1234567',
      })
      .expect(201);
  });

  it(' Admin reset password token should been destroyed after first used', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/reset-password')
      .set('Authorization', `Bearer ${resetPasswordToken}`)
      .send({
        password: '12345678',
      })
      .expect(401);
  });

  it(' Admin login with new password', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: '1234567',
      })
      .expect(201);
  });
});
