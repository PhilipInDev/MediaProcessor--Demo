import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PASS,
	RABBIT_MQ_USER,
	RABBIT_MQ_PORT,
	RABBIT_MQ_QUEUE_NAME,
} from '../../../config';

@Module({
	imports: [],
	controllers: [MediaController],
	providers: [
		{
			provide: 'RABBIT_MQ_SERVICE',
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`],
						queue: RABBIT_MQ_QUEUE_NAME,
						queueOptions: {
							durable: false,
						},
					},
				})
			},
		}
	],
})
class MediaModule {}

export { MediaModule };

