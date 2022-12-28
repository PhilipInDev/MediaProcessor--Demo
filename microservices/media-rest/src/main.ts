import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MediaModule } from './api';
import {
  RABBIT_MQ_HOST,
  RABBIT_MQ_PORT,
  RABBIT_MQ_PASS,
  RABBIT_MQ_USER,
  RABBIT_MQ_QUEUE_NAME,
  API_PORT,
} from '../config';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`],
      queue: RABBIT_MQ_QUEUE_NAME,
      queueOptions: {
        durable: false
      },
    },
  })

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  await app.listen(API_PORT);
}
bootstrap();
