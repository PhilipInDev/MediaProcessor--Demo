import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MediaController } from './media.controller';
import {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PASS,
	RABBIT_MQ_USER,
	RABBIT_MQ_PORT,
} from '../../../config';
import { MediaService } from './media.service';
import {
	FileGeneralModel,
	FileMetadataModel,
} from '../../database';

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

		SequelizeModule.forFeature([FileMetadataModel]),
		SequelizeModule.forFeature([FileGeneralModel]),
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

