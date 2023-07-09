import * as supertest from 'supertest';

import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' User Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userToken;
  it(' User login ', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('admin@gmail.com');
        userToken = resultObject.payload.token;
      });
  });
});
