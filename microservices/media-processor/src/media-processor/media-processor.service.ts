import { Injectable } from '@nestjs/common';

@Injectable()
class MediaProcessorService {
	processFile(): string {
		return 'Hello World!';
	}
}

export { MediaProcessorService };
