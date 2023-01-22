import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { isEqual, uniqWith } from 'lodash';

class MediaHelpers {

	static async requestUsingQueue<Payload>(
		amqpConnection: AmqpConnection,
		data: any,
		settings: { queueName: string; exchange: string; routingKey: string }
	) {
		await amqpConnection.managedChannel.assertQueue(settings.queueName);
		await amqpConnection.managedChannel.bindQueue(settings.queueName, settings.exchange, settings.routingKey);
		return amqpConnection.request({
			exchange: settings.exchange,
			routingKey: settings.routingKey,
			payload: data
		}) as Payload;
	}

	static async publishIntoQueue (
		amqpConnection: AmqpConnection,
		data: any,
		settings: { queueName: string; exchange: string; routingKey: string }
	) {
		await amqpConnection.managedChannel.assertQueue(settings.queueName);
		await amqpConnection.managedChannel.bindQueue(settings.queueName, settings.exchange, settings.routingKey);
		amqpConnection.publish(settings.exchange, settings.routingKey, data);
	}

	static hasDuplicates(array: unknown[]) {
		const uniqueValues = uniqWith(array, isEqual);

		return uniqueValues.length !== array.length;
	}
}

export { MediaHelpers };
