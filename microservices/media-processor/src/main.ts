import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MediaProcessorModule } from './media-processor/media-processor.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaProcessorModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5000'],
        queue: 'media:process',
        queueOptions: {
          durable: false
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
