import * as supertest from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' User Category Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' User Get Category List', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/categories')
      .send({})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].title).toEqual('default category');
        expect(resultObject.payload.pagination.itemsPerPage).toEqual(10);
        expect(resultObject.payload.pagination.totalPages).toEqual(1);
        expect(resultObject.payload.pagination.currentPage).toEqual(1);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
        expect(resultObject.payload.pagination.totalItems).toEqual(1);
      });
  });
});
