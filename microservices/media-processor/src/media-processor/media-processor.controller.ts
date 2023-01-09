import { Controller, HttpStatus } from '@nestjs/common';
import {
	MessageHandlerErrorBehavior,
	RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { MediaProcessorService } from './media-processor.service';
import { MediaProcessorPayload } from './media-processor.type';

@Controller()
class MediaProcessorController {
	constructor(
		private readonly mediaProcessorService: MediaProcessorService,
	) {}

	@RabbitRPC({
		exchange: 'exchange1',
		routingKey: 'media:process',
		queue: 'media:process',
		errorBehavior: MessageHandlerErrorBehavior.ACK,
	})
	async processFile(data: MediaProcessorPayload) {
		try {
			await this.mediaProcessorService.scanContentForExceptions(data.file);
		} catch (e) {
			return {
				error: e?.message,
				statusCode: HttpStatus.BAD_REQUEST,
			}
		}

		this.mediaProcessorService.processFile(data);

		return null;
	}
}

export { MediaProcessorController };
