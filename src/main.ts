import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{snapshot:true});
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  
  app.enableCors();
  // app.set('etag', false);
  const nodeEnv = process.env.NODE_ENV;
  let document;
  if (nodeEnv !== 'production') {
    const VERSION = configService.get('SWAGGER_VERSION');
    const TITLE = configService.get('SWAGGER_TITLE');
    const swaggerOptions = new DocumentBuilder()
      .setTitle(TITLE)
      .setVersion(VERSION)
      .addBearerAuth()
      .setExternalDoc('Postman Collection', '/docs-json')
      .build();
    document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('/api-docs', app, document);
    SwaggerModule.setup('/docs', app, document);
  }
  await app.listen(+configService.get('PORT'));

  return nodeEnv !== 'production'
    ? {
        app,
        swagger: document,
      }
    : { app };
}

bootstrap();
