import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MediaProcessorController } from './media-processor.controller';
import { MediaProcessorService } from './media-processor.service';
import {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PASS,
	RABBIT_MQ_USER,
	RABBIT_MQ_PORT,
} from '../../config';
import { OCRService } from '../ocr';

@Module({
	imports: [
		RabbitMQModule.forRoot(RabbitMQModule, {
			exchanges: [
				{
					name: 'exchange1',
					type: 'direct',
				},
			],
			uri: `amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`,
			connectionInitOptions: { wait: false },
			enableControllerDiscovery: true,
		}),
	],
	controllers: [MediaProcessorController],
	providers: [
		MediaProcessorService,
		MediaProcessorController,
		OCRService,
	],
	exports: [RabbitMQModule],
})
class MediaProcessorModule {}

export { MediaProcessorModule };
