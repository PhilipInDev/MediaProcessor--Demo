import { Injectable } from '@nestjs/common';

@Injectable()
class MediaService {
	processFile() {
		return 'Hello World!';
	}
}

export { MediaService };
