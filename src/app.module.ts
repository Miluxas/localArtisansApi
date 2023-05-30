import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import process from 'process';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { HealthModule } from './health/health.module';
import { IdentityModule } from './identity/identity.module';
import { ResponseFormatter } from './interceptors/formatter/formatter.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CacheModule } from '@nestjs/cache-manager';

const nodeEnv = process.env.NODE_ENV;

process.env.TEST_DB_NAME = `miluxas_test_${Math.random()
  .toString(36)
  .substring(2, 10)}`;
@Module({
  imports: [
    DevtoolsModule.register({
      http:nodeEnv !== 'production',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        connectTimeoutMS: 10 * 60 * 60,
        dropSchema: nodeEnv == 'test',
        ssl: process.env.DB_SSL_CA
          ? {
              ca: process.env.DB_SSL_CA,
            }
          : null,
  
        migrationsTableName: 'migrations',
        entities: [__dirname + '/**/**.entity{.ts,.js}'],
        subscribers: [__dirname + '/**/**.subscriber{.ts,.js}'],
        migrations: [__dirname + '/migrations/*.js'],
        migrationsRun: true,
        autoLoadEntities: true,
        logging: false,
        synchronize: nodeEnv == 'test',
      }
    ),
    CacheModule.register({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    AuthModule,
    ActivityLogModule,
    ErrorHandlerModule,
    HealthModule,
    IdentityModule,
    ScheduleModule.forRoot(),
    ProductModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatter,
    },
  ],
})
export class AppModule {}
