import { Controller, HttpStatus } from '@nestjs/common';
import {
	MessageHandlerErrorBehavior,
	RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { MediaProcessorService } from './media-processor.service';

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
	async processFile(data: { fileUrl: string }) {
		try {
			await this.mediaProcessorService.scanContentForExceptions(data.fileUrl);
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
