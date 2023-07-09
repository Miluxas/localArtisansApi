import * as supertest from 'supertest';

import {
  app,
  baseAfterAll,
  baseBeforeAll,
  checkPaginationResult,
} from '../../test/base_e2e_spec';

describe('User Admin Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let adminToken;
  it(' Admin login ', async() => {
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
  it('Admin Get User List By Sort', async() => {
    return (
      supertest
        .agent(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ sort: 'lowestPrice' })
        // .expect(201)
        .then((result) => {
          const resultObject = JSON.parse(result.text);

          //
          expect(resultObject.payload.items[0].firstName).toEqual('admin');
          checkPaginationResult(resultObject);
        })
    );
  });

  it(' Admin update a user info ', async () => {
    return supertest
      .agent(app.getHttpServer())
      .put('/admin/user/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Updated firstName',
        lastName: 'Updated lastName',
        birthDate: '1982/02/20',
        bio: 'about me and my life',
        cityId: 1,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('Updated firstName');
      });
  });

  let userToken;
  it(' User login ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@gmail.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('user@gmail.com');
        userToken = resultObject.payload.token;
      });
  });
  it(' User can not get user list after has been blocked with admin', async() => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/user/list')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it(' Admin can block a user ', async () => {
    return supertest
      .agent(app.getHttpServer())
      .put('/admin/user/2/activation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        active: false,
      })
      .expect(200);
  });

  it(' Blocked user login should throw exception ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@gmail.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(400);
  });
});
