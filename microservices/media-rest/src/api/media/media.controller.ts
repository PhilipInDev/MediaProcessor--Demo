import {
	Post,
	Body,
	Inject,
	HttpCode,
	Controller,
	UseFilters,
	UseInterceptors
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FormatResponseInterceptor } from '../../interceptors';
import { ProcessMediaDto } from './media.dto';
import { AppRoutes } from '../../common';
import { RABBIT_MQ_QUEUE_NAME } from '../../../config';
import { ExceptionFilter } from '../../classes';

@Controller(AppRoutes.MEDIA)
@UseInterceptors(FormatResponseInterceptor)
class MediaController {
	constructor(
		@Inject('RABBIT_MQ_SERVICE') private rabbitMqService: ClientProxy,
	) {}

	@Post('process')
	@HttpCode(202)
	@UseFilters(new ExceptionFilter())
	processFile(@Body() data: ProcessMediaDto) {
		return this.rabbitMqService.send(RABBIT_MQ_QUEUE_NAME, data);
	}
}

export { MediaController };
