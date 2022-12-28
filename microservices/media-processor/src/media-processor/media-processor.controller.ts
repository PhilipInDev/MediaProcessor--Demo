import { Controller } from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import { MediaProcessorService } from './media-processor.service';
import { RABBIT_MQ_QUEUE_NAME } from '../../config';

@Controller()
class MediaProcessorController {
	constructor(private readonly mediaProcessorService: MediaProcessorService) {}

	@MessagePattern(RABBIT_MQ_QUEUE_NAME)
	processFile(@Payload() data: string) {
		console.log('QUEQUE QUE QUE  >>>>>>', data)
		return this.mediaProcessorService.processFile();
	}
}

export { MediaProcessorController };
