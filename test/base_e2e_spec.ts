import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { ActivityLogService } from '../src/activity-log/activity-log.service';
import { AppModule } from '../src/app.module';

import { CodeGeneratorService } from '../src/auth/code-generator.service';
import { NotificationService } from '../src/notification/notification.service';

export let app: INestApplication;
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: process.env.TEST_DB_PASSWORD,
};
export const baseBeforeAll = async () => {
  const pool = psql.createPool(connectionConfig);
 
  const activityLogService = { log: () => {} };

  const codeGeneratorService = {
    generateCode: (length: number): string => {
      return '123456';
    },
  };

  const notificationService = {
    sendOtpEmail(user: { firstName: string; email: string }, otpCode: string) {
      return 'test';
    },

    sendForgetPasswordOtpCodeEmail(
      user: { firstName: string; email: string },
      otpCode: string,
    ) {
      return 'test';
    },

    sendAdminForgetPAsswordEmail(
      user: { firstName: string; email: string },
      link: string,
    ) {
      return 'test';
    },
  };

  await pool.execute('CREATE DATABASE ' + process.env.TEST_DB_NAME);
  pool.end();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ActivityLogService)
    .useValue(activityLogService)
    .overrideProvider(CodeGeneratorService)
    .useValue(codeGeneratorService)
    .overrideProvider(NotificationService)
    .useValue(notificationService)
    .compile();
  await initDb();

  app = moduleFixture.createNestApplication();
  await app.init();
};
export const baseAfterAll = async () => {
  const pool = mysql.createPool(connectionConfig);
  await pool
    .execute('DROP DATABASE ' + process.env.TEST_DB_NAME)
    .catch((e) => {});
  pool.end();
};

export const createNormalUser = () => {
  return app.getHttpServer().post('/auth/register').send({
    firstName: 'test user',
    lastName: 'test family',
    email: 'miluxas@gmail.com',
    password: 'password-string',
    role: 'customer',
  });
};

export const checkPaginationResult = (
  resultObject,
  itemCount = 1,
  totalItem = 1,
) => {
  expect(resultObject.payload.pagination.itemsPerPage).toEqual(10);
  expect(resultObject.payload.pagination.totalPages).toEqual(1);
  expect(resultObject.payload.pagination.currentPage).toEqual(1);
  expect(resultObject.payload.pagination.itemCount).toEqual(itemCount);
  expect(resultObject.payload.pagination.totalItems).toEqual(totalItem);
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function initDb() {
  const pool2 = mysql.createPool({
    ...connectionConfig,
    database: process.env.TEST_DB_NAME,
  });

  await pool2.execute(`
  INSERT INTO role(id, title) VALUES 
  ('1','admin'),
  ('2','artisan'),
  ('3','customer');`);

  await pool2.execute(`
  INSERT INTO identity(id, createdAt, updatedAt, username, type, emailVerified, password, active, roleId) VALUES 
  ('1','2022-11-04 01:02:08.154808','2022-11-04 01:02:08.000000','miluxas@gmail.com','Admin','1','$2b$10$8mRCo22QMQhMGz2mHAYo0ufV3ObFWFA/J.LPXr9U3tdDUbigqOOiy','1','1'),
  ('2','2022-11-04 01:02:08.257598','2022-11-04 01:02:08.000000','user@gmail.com','User','1','$2b$10$0xvGbRlSC7q36wQN93feBemgh/d171.k82gtuzL6Hkl9cW15rVWSO','1','3');`);

  await pool2.execute(`
  INSERT INTO user(id, createdAt, updatedAt, deleteAt, firstName, lastName, email, birthDate, gender, bio, phoneNumber, IdentityId) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'admin','admin','miluxas@gmail.com',NULL,NULL,NULL,NULL,'1'),
  ('2','2022-11-04 01:02:08.265533','2022-11-04 01:02:08.265533',NULL,'user','user','user@gmail.com',NULL,NULL,NULL,NULL,'2');`);

  await pool2.execute(`SET GLOBAL max_connections = 2048;`);

  pool2.end();
}
