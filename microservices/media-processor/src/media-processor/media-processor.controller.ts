import { Controller } from '@nestjs/common';
import {
	MessageHandlerErrorBehavior,
	RabbitRPC,
	RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { MediaProcessorService } from './media-processor.service';
import { MediaProcessorPayload } from './media-processor.type';

@Controller()
class MediaProcessorController {
	constructor(
		private readonly mediaProcessorService: MediaProcessorService,
	) {}

	@RabbitSubscribe({
		exchange: 'exchange1',
		routingKey: 'media:process',
		queue: 'media:process',
		errorBehavior: MessageHandlerErrorBehavior.ACK,
	})
	async processFile(data: MediaProcessorPayload) {
		await this.mediaProcessorService.processFile(data);
	}

	@RabbitRPC({
		exchange: 'exchange1',
		routingKey: 'media:process:supported-ocr-languages',
		queue: 'media:process:supported-ocr-languages',
	})
	async getSupportedOCRLanguages() {
		return this.mediaProcessorService.getSupportedOCRLanguages();
	}
}

export { MediaProcessorController };
