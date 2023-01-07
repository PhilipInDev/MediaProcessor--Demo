import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MediaController } from './media.controller';
import {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PASS,
	RABBIT_MQ_USER,
	RABBIT_MQ_PORT,
} from '../../../config';
import { MediaService } from './media.service';

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
		}),
	],
	controllers: [MediaController],
	providers: [
		MediaService,
		MediaController,
	],
	exports: [RabbitMQModule],
})
class MediaModule {}

export { MediaModule };

