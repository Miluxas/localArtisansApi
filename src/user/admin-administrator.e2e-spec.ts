import * as supertest from 'supertest';
import {
  app,
  baseAfterAll,
  baseBeforeAll,
  checkPaginationResult,
} from '../../test/base_e2e_spec';
import { UserError, userErrorMessages } from './user.error';


describe('Administrator Controller', () => {
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

  it(' Admin get admin detail', () => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/administrators/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.email).toEqual('admin@gmail.com');
      });
  });

  it(' Admin Get Admin List', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/administrators')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].firstName).toEqual('admin');
        checkPaginationResult(resultObject);
      });
  });

  it(' Admin get admin detail throw exception by invalid id', () => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/administrators/100')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          userErrorMessages[UserError.NOT_FOUND].message,
        );
      });
  });
});
