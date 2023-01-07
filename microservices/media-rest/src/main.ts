import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MediaModule } from './api';
import {
  API_PORT,
} from '../config';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  await app.listen(API_PORT);
}
bootstrap();
