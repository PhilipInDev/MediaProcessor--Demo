import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  RABBIT_MQ_QUEUE_NAME,
  RABBIT_MQ_HOST,
  RABBIT_MQ_PORT,
  RABBIT_MQ_USER, RABBIT_MQ_PASS
} from '../config';
import { MediaProcessorModule } from './media-processor/media-processor.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaProcessorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`],
        queue: RABBIT_MQ_QUEUE_NAME,
        queueOptions: {
          durable: false
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
