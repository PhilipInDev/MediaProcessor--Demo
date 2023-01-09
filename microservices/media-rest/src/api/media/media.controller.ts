import {
	Post,
	Body,
	HttpCode,
	Controller,
	UseFilters,
	UseInterceptors,
	HttpException,
	Get,
} from '@nestjs/common';
import {
	RabbitSubscribe
} from '@golevelup/nestjs-rabbitmq';
import { FormatResponseInterceptor } from '../../interceptors';
import { ProcessMediaDto } from './media.dto';
import { AppRoutes, FileInfo } from '../../common';
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
		const res = await this.mediaService.processFile(data);

		if (res?.error) {
			throw new HttpException(res.error, res.statusCode);
		}

		return res;
	}

	@Get('aggregated/stats')
	@UseFilters(new ExceptionFilter())
	async getAggregatedStats() {
		return this.mediaService.getAggregatedFilesStats();
	}

	@RabbitSubscribe({
		exchange: 'exchange1',
		queue: 'media:aggregate',
		routingKey: 'media:aggregate',
	})
	async aggregateFileInfo(data: FileInfo) {
		await this.mediaService.aggregateFileInfo(data);
	}
}

export { MediaController };
