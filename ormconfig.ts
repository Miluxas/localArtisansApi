import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'local';
const dotenv_path = path.resolve(process.cwd(), `.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  console.log(result.error);
}

const mysqlConnectionOption = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.DB_SSL_CA
    ? {
        ca: process.env.DB_SSL_CA,
      }
    : null,
};

export const migrationDataSourceOptions = <DataSourceOptions>{
  ...mysqlConnectionOption,
  bigNumberStrings: false,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/dist/src/**/**.entity{.ts,.js}'],
  subscribers: [__dirname + '/dist/src/subscriber/**/*{.ts,.js}'],
  migrations: [__dirname + '/dist/src/migrations/*{.ts,.js}'],
};
export const connectionSource = new DataSource(migrationDataSourceOptions);
export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...(<DataSourceOptions>mysqlConnectionOption),
  entities: [__dirname + '/dist/src/**/entities/*.entity.{ts,js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: env == 'test',
  cache: {
    type: 'redis',
    options: {
      host:
        process.env.REDIS_HOST ?? 'redis-master.qudra-dev.svc.cluster.local',
      port: process.env.REDIS_PORT ?? 6379,
      no_ready_check: true,
      auth_pass: process.env.REDIS_PASS ?? 'iularwOpsWpQRFyt2gQzhxoBa',
      // password: process.env.REDIS_PASS ?? 'iularwOpsWpQRFyt2gQzhxoBa',
    },
  },
};
