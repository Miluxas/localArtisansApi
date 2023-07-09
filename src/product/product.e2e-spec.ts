import * as supertest from 'supertest';
import {
  app,
  baseAfterAll,
  baseBeforeAll,
  checkPaginationResult,
} from '../../test/base_e2e_spec';


describe(' User Product Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userToken;
  it(' User login ', async() => {
    return supertest
      .product(app.getHttpServer())
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

  it(' User Register New Product', async() => {
    return supertest
      .product(app.getHttpServer())
      .post('/products/register')
      .set('Authorization', `Bearer ${userToken}`)
      .send({title:'test product'})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('test product');
      });
  });

  it(' User Get Product List', async() => {
    return supertest
      .product(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].title).toEqual('test product');
      });
  });
});
