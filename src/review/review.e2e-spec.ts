import * as supertest from 'supertest';
import {
  app,
  baseAfterAll,
  baseBeforeAll,
  sleep,
} from '../../test/base_e2e_spec';
import {
  ReviewError,
  reviewErrorMessages,
} from './review.error';

describe('Packages Service Controller', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let freelancerToken;
  let freelancerId;

  it(' Freelancer login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'freelancer@nizek.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('freelancer@nizek.com');
        freelancerToken = resultObject.payload.token;
        freelancerId = resultObject.payload.user.id;
      });
  });

  let packageId;
  let serviceId;
  it(' Freelancer Create New Service', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/services/create')
      .set('Authorization', `Bearer ${freelancerToken}`)
      .send({
        title: 'service title',
        description: 'description of a package and describe it',
        categoryId: 1,
        tags: ['tag 1', 'tag 2'],
        packages: [
          {
            title: 'package 1',
            description: 'package description of a package and describe it',
            deliveryTime: 10,
            deliveryTimeUnitId: 1,
            price: 1000,
            items: ['one', 'two'],
            isActive: true,
          },
        ],
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('service title');
        expect(resultObject.payload.packages[0].title).toEqual('package 1');
        expect(resultObject.payload.packages[0].deliveryTimeUnit.title).toEqual(
          'days',
        );
        expect(resultObject.payload.packages[0].price).toEqual('1000.000');
        packageId = resultObject.payload.packages[0].id;
        serviceId = resultObject.payload.id;
      });
  });

  it(' Freelancer get Service Package list', () => {
    return supertest
      .agent(app.getHttpServer())
      .post(`/services/${serviceId}/packages`)
      .set('Authorization', `Bearer ${freelancerToken}`)
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(1);
      });
  });

  let customerToken;
  it(' Customer login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'customer@nizek.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('customer@nizek.com');
        customerToken = resultObject.payload.token;
      });
  });

  let customer2Token;
  it(' Second Customer login ', () => {
    return supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'customer2@nizek.com',
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual('customer2@nizek.com');
        customer2Token = resultObject.payload.token;
      });
  });

  it(' Exception throw On Add comment without rate', () => {
    return supertest
      .agent(app.getHttpServer())
      .post(`/packages/${packageId}/comments`)
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        content: 'updated comment',
      })
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual('Validation Error');
      });
  });

  let commentId;
  it(' Customer Add A Comment To A Package', () => {
    return supertest
      .agent(app.getHttpServer())
      .post(`/packages/${packageId}/comments`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        rate: 4,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        commentId = resultObject.payload.id;
        expect(resultObject.payload.rate).toEqual('4.0');
      });
  });

  it(' Freelancer Rate Average should be updated', async () => {
    await sleep(200);
    return supertest
      .agent(app.getHttpServer())
      .post('/freelancers')
      .send({
        filters: { id: freelancerId },
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].rateAverage).toEqual('4.00');
      });
  });

  it(' Customer Add A Comment To A Package Again, Comment should be overwritten', () => {
    return supertest
      .agent(app.getHttpServer())
      .post(`/packages/${packageId}/comments`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        content: 'again description of a package and describe it',
        rate: 4.5,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.rate).toEqual('4.5');
        expect(resultObject.payload.content).toEqual(
          'again description of a package and describe it',
        );
        expect(resultObject.payload.id).toEqual(commentId);
      });
  });

  it(' Freelancer Rate Average should be updated', async () => {
    await sleep(200);

    return supertest
      .agent(app.getHttpServer())
      .post('/freelancers')
      .send({
        filters: { id: freelancerId },
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].rateAverage).toEqual('4.50');
      });
  });

  it(' Customer Get Service detail', () => {
    return supertest
      .agent(app.getHttpServer())
      .get(`/services/${serviceId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('service title');
        expect(resultObject.payload.reviews.length).toEqual(1);
      });
  });

  it(' Customer Update A Comment', () => {
    return supertest
      .agent(app.getHttpServer())
      .put(`/packages/${packageId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        content: 'updated description of a package and describe it',
        rate: 3,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        commentId = resultObject.payload.id;
        expect(resultObject.payload.content).toEqual(
          'updated description of a package and describe it',
        );
        expect(resultObject.payload.rate).toEqual('3.0');
      });
  });

  it(' Freelancer Rate Average should be updated', async () => {
    await sleep(200);

    return supertest
      .agent(app.getHttpServer())
      .post('/freelancers')
      .send({
        filters: { id: freelancerId },
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].rateAverage).toEqual('3.00');
      });
  });

  it(' Exception throw On Update Other customer comment', () => {
    return supertest
      .agent(app.getHttpServer())
      .put(`/packages/${packageId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        content: 'updated description of a package and describe it',
        rate: 3,
      })
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          reviewErrorMessages[
            ReviewError.PACKAGE_REVIEW_NOT_FOUND
          ].message,
        );
      });
  });

  it(' Customer Get Package Detail', () => {
    return supertest
      .agent(app.getHttpServer())
      .get(`/packages/${packageId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.rateAverage).toEqual('3.00');
        expect(resultObject.payload.reviewCount).toEqual(1);
      });
  });

  it(' Customer Delete A Comment', () => {
    return supertest
      .agent(app.getHttpServer())
      .delete(`/packages/${packageId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(204);
  });

  it(' Freelancer Rate Average should be updated', async () => {
    await sleep(200);

    return supertest
      .agent(app.getHttpServer())
      .post('/freelancers')
      .send({
        filters: { id: freelancerId },
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].rateAverage).toEqual(undefined);
      });
  });

  it(' Exception throw On Delete Other customer comment', () => {
    return supertest
      .agent(app.getHttpServer())
      .delete(`/packages/${packageId}/comments/${commentId}`)
      .set('Authorization', `Bearer ${customer2Token}`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          reviewErrorMessages[
            ReviewError.PACKAGE_REVIEW_NOT_FOUND
          ].message,
        );
      });
  });
});
