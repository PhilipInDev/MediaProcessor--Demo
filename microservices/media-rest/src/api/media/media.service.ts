import { HttpStatus, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
class MediaService {

	constructor(
		private amqpConnection: AmqpConnection
	) {}

	async processFile(data): Promise<{ error?: string | null, statusCode: HttpStatus }> {
		await this.amqpConnection.managedChannel.assertQueue('media:process');
		await this.amqpConnection.managedChannel.bindQueue('media:process', 'exchange1', 'media:process');

		return this.amqpConnection.request({
			exchange: 'exchange1',
			routingKey: 'media:process',
			payload: data,
		});
	}

	async aggregateFileMetadata(data: object) {
		console.log('aggregate-service:data', data)
	}
}

export { MediaService };
