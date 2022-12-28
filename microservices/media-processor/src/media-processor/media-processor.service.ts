import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
class MediaProcessorService {
	processFile(): string {
		throw new RpcException('Exception from media-processor service');
	}
}

export { MediaProcessorService };
