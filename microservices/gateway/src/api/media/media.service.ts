import { Injectable } from '@nestjs/common';

@Injectable()
class MediaService {
	processFile(): string {
		return 'Hello World!';
	}
}

export { MediaService };
