import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MediaProcessorModule } from './media-processor/media-processor.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaProcessorModule,
  );
  await app.listen();
}
bootstrap();
