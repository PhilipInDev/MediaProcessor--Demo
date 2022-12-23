import { Controller, Post, HttpCode, UseInterceptors, Body } from '@nestjs/common';
import { MediaService } from './media.service';
import { FormatResponseInterceptor } from '../../interceptors';
import { ProcessMediaDto } from './media.dto';
import { AppRoutes } from '../../common';

@Controller(AppRoutes.MEDIA)
@UseInterceptors(FormatResponseInterceptor)
class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post('process')
	@HttpCode(202)
	processFile(@Body() data: ProcessMediaDto) {
		return this.mediaService.processFile();
	}
}

export { MediaController };
