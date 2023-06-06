import * as supertest from "supertest";
import {
  app,
  baseAfterAll,
  baseBeforeAll
} from "../../test/base_e2e_spec";

describe("Admin Order Controller", () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let adminToken;
  it(" Admin login ", () => {
    return supertest
      .order(app.getHttpServer())
      .post("/admin/auth/login")
      .send({
        email: "admin@gmail.com",
        password: process.env.TEST_USER_PASSWORD,
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.email).toEqual("admin@gmail.com");
        adminToken = resultObject.payload.token;
      });
  });
});
