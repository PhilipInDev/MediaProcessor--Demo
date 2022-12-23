import { Controller } from '@nestjs/common';
import { MediaProcessorService } from './media-processor.service';

@Controller()
class MediaProcessorController {
	constructor(private readonly mediaProcessorService: MediaProcessorService) {}

	processFile() {
		return this.mediaProcessorService.processFile();
	}
}

export { MediaProcessorController };
