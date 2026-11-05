import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BEARER_AUTH_NAME } from './common/swagger/swagger.helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //?=======================================
  //* Swagger / OpenAPI
  //* UI:   GET /docs
  //* JSON: GET /docs-json
  //?=======================================
  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription(
      [
        'REST API for the E-Commerce backend (NestJS + MongoDB).',
        '',
        '**Authentication:** call `POST /auth/sign-in` (or `/auth/sign-up`, `/auth/google`), ' +
          'copy the `access_token` from the response, click **Authorize** and paste it.',
        '',
        '**Roles:** `user` and `admin`. A wrong role returns `401` (not `403`).',
        '',
        '**Success envelope:** most endpoints return `{ status, message, data }`.',
        '',
        '**Errors:** `{ statusCode, message, error }` – `message` is an array when validation fails.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT returned by the auth endpoints',
      },
      BEARER_AUTH_NAME,
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}
bootstrap();
