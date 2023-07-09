import * as supertest from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';
import { CategoryError, categoryErrorMessages } from './category.error';

describe('Admin Category Controller', async() => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let adminToken;
  it(' Admin login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/auth/login')
      .send({
        email: 'admin@nizek.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('admin@nizek.com');
        adminToken = resultObject.payload.token;
      });
  });

  let mediaId;

  const uploadMedia = () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/media')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', './test/nob.jpg')
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.originalName).toEqual('nob.jpg');
        mediaId = resultObject.payload.id;
      });
  };
  it(' Upload media', uploadMedia);

  let mainCategoryId;
  it(' Admin Create New Category', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'main category',
        isActive: true,
        mediaId: mediaId,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('main category');
        mainCategoryId = resultObject.payload.id;
      });
  });

  it(' Admin Create New Sub Category', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'sub category',
        isActive: true,
        mediaId: mediaId,
        parentId: mainCategoryId,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('sub category');
        expect(resultObject.payload.image.url).toEqual('fake-url');
        expect(resultObject.payload.parent.title).toEqual('main category');
        expect(resultObject.payload.parent.image.url).toEqual('fake-url');
      });
  });

  it(' Admin Get Category List', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[1].title).toEqual('main category');
        expect(resultObject.payload.pagination.itemsPerPage).toEqual(10);
        expect(resultObject.payload.pagination.totalPages).toEqual(1);
        expect(resultObject.payload.pagination.currentPage).toEqual(1);
        expect(resultObject.payload.pagination.itemCount).toEqual(3);
        expect(resultObject.payload.pagination.totalItems).toEqual(3);
      });
  });

  it(' Admin Get Main Category Detail', async() => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/categories/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('main category');
        expect(resultObject.payload.image.url).toEqual('fake-url');
        expect(resultObject.payload.children[0].title).toEqual('sub category');
      });
  });

  it(' Upload Other media', uploadMedia);

  it(' Admin Update Main Category', async() => {
    return supertest
      .agent(app.getHttpServer())
      .put('/admin/categories/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'updated title main category',
        isActive: true,
        mediaId,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual(
          'updated title main category',
        );
        expect(resultObject.payload.image.id).toEqual(mediaId);
      });
  });

  it(' Admin can inactive category ', async () => {
    return supertest
      .agent(app.getHttpServer())
      .put('/admin/categories/3/activation')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        active: false,
      })
      .expect(200);
  });

  it(' Exception throw On Get Wrong Id', async() => {
    return supertest
      .agent(app.getHttpServer())
      .get('/admin/categories/10')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          categoryErrorMessages[CategoryError.CATEGORY_NOT_FOUND].message,
        );
      });
  });

  it(' Exception throw on create new category without title', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isActive: true,
        mediaId: mediaId,
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });

  it(' Exception throw on create new category without isActive', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'main category',
        mediaId: mediaId,
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });

  it(' Exception throw on create new category without mediaId', async() => {
    return supertest
      .agent(app.getHttpServer())
      .post('/admin/categories/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'main category',
        isActive: true,
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });
});
