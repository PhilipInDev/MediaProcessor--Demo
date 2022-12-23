import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MediaModule } from './api';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
