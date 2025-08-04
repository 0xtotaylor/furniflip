import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { urlencoded, json, raw } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SentryFilter } from './common/filter/sentry.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1/core');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.use(
    '/api/v1/core/profiles/subscription',
    raw({ type: 'application/json' }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
