import {
	Post,
	Body,
	HttpCode,
	Controller,
	UseFilters,
	UseInterceptors,
	Get,
} from '@nestjs/common';
import {
	RabbitSubscribe
} from '@golevelup/nestjs-rabbitmq';
import { FormatResponseInterceptor } from '../../interceptors';
import { ProcessMediaDtoArray } from './media.dto';
import { AppRoutes, FileProcessingResult } from '../../common';
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
	async processFile(@Body() data: ProcessMediaDtoArray) {
		return this.mediaService.processFile(data);
	}

	@Get('aggregated/stats')
	@UseFilters(new ExceptionFilter())
	async getAggregatedStats() {
		return this.mediaService.getAggregatedFilesStats();
	}

	@Get('process/supported-ocr-languages')
	@UseFilters(new ExceptionFilter())
	async getSupportedOCRLanguages() {
		return this.mediaService.getSupportedOCRLanguages();
	}

	@RabbitSubscribe({
		exchange: 'exchange1',
		queue: 'media:aggregate',
		routingKey: 'media:aggregate',
	})
	async aggregateFileInfo(data: FileProcessingResult) {
		await this.mediaService.aggregateFileInfo(data);
	}

	@RabbitSubscribe({
		exchange: 'exchange1',
		queue: 'media:process:error',
		routingKey: 'media:process:error',
	})
	async handleMediaProcessingError(data: { operationKey: string; error: Error }) {
		await this.mediaService.handleMediaProcessingError(data.error, data.operationKey);
	}
}

export { MediaController };
