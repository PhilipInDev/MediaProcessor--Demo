import { Module } from '@nestjs/common';
import { MediaProcessorController } from './media-processor.controller';
import { MediaProcessorService } from './media-processor.service';

@Module({
	imports: [],
	controllers: [MediaProcessorController],
	providers: [MediaProcessorService],
})
class MediaProcessorModule {}

export { MediaProcessorModule };
