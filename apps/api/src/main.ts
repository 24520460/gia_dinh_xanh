import 'reflect-metadata';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Nạp biến môi trường trước khi import các module khác
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseExceptionFilter());

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`🚀 [Gia Đình Xanh API] Server đang chạy tại: http://localhost:${port}/api`);
}

bootstrap();
