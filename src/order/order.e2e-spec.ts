import * as supertest from 'supertest';
import {
  app,
  baseAfterAll,
  baseBeforeAll,
  checkPaginationResult,
} from '../../test/base_e2e_spec';


describe(' User Order Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userToken;
  it(' User login ', () => {
    return supertest
      .order(app.getHttpServer())
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

  it(' User Register New Order', () => {
    return supertest
      .order(app.getHttpServer())
      .post('/orders/register')
      .set('Authorization', `Bearer ${userToken}`)
      .send({title:'test order'})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('test order');
      });
  });

  it(' User Get Order List', () => {
    return supertest
      .order(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].title).toEqual('test order');
      });
  });
});
