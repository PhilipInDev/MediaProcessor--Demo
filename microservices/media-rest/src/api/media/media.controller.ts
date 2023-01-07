import {
	Post,
	Body,
	HttpCode,
	Controller,
	UseFilters,
	UseInterceptors, HttpException
} from '@nestjs/common';
import {
	RabbitSubscribe
} from '@golevelup/nestjs-rabbitmq';
import { FormatResponseInterceptor } from '../../interceptors';
import { ProcessMediaDto } from './media.dto';
import { AppRoutes } from '../../common';
import { ExceptionFilter } from '../../classes';
import { MediaService } from './media.service';

@Controller(AppRoutes.MEDIA)
@UseInterceptors(FormatResponseInterceptor)
class MediaController {
	constructor(
		private mediaService: MediaService,
	) {}

	@Post('process')
	@HttpCode(202)
	@UseFilters(new ExceptionFilter())
	async processFile(@Body() data: ProcessMediaDto) {
		const result = await this.mediaService.processFile(data);

		if (result?.error) {
			throw new HttpException(result.error, result.statusCode);
		}

		return result;
	}

	@RabbitSubscribe({
		exchange: 'exchange1',
		queue: 'media:aggregate',
		routingKey: 'media:aggregate',
	})
	async aggregateFileMetadata(data: object) {
		console.log('data', data)
		await this.mediaService.aggregateFileMetadata(data);
	}
}

export { MediaController };
