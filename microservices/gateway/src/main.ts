import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MediaModule } from './api';
import {Transport} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5000'],
      queue: 'media:process',
      queueOptions: {
        durable: false
      },
    },
  })

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
