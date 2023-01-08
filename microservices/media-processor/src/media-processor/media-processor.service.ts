import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ErrorMessage } from './error-message.enum';
import { FileType } from './file-types.enum';
import { supportedMediaTypesConfig } from './supported-media-types.config';
import { MPHelpers } from './media-processor.helpers';
import { MAX_FILE_SIZE_MB } from '../../config';

@Injectable()
class MediaProcessorService {
	constructor(
		private readonly amqpConnection: AmqpConnection
	) {}

	private MAX_FILE_SIZE_MB = Number(MAX_FILE_SIZE_MB);

	public async scanContentForExceptions(fileUrl: string) {
		const { headers: metaHeaders } = await fetch(fileUrl, { method: 'HEAD' });
		const { contentType, contentSizeMb } = MPHelpers.getFileMetadataByHttpHeaders(metaHeaders);

		if (!supportedMediaTypesConfig.includes(contentType)) {
			throw new RpcException({
				message: `${ErrorMessage.CONTENT_TYPE_IS_NOT_SUPPORTED}. File type is: ${contentType}. Supported types: ${supportedMediaTypesConfig.join(', ')}.`,
				statusCode: HttpStatus.BAD_REQUEST,
			});
		}

		if (this.MAX_FILE_SIZE_MB < contentSizeMb) {
			throw new RpcException({
				message: `${ErrorMessage.CONTENT_SIZE_IS_TOO_LARGE}. Max content size is ${this.MAX_FILE_SIZE_MB}MB`,
				statusCode: HttpStatus.BAD_REQUEST,
			});
		}
	}

	private processVideo(filePath: string) {
		console.log('process video')
	}

	private processAudio(filePath: string) {
		console.log('process audio')
	}

	private processImage(filePath: string) {
		console.log('process image', filePath);
	}

	async processFile({ fileUrl } : { fileUrl: string }) {
		const res = await fetch(fileUrl);

		const { contentType, contentSizeBytes } = MPHelpers.getFileMetadataByHttpHeaders(res.headers);

		const fileType = MPHelpers.getFileType(contentType);

		const fileExtension = MPHelpers.getFileExtension(contentType)

		const dirPath = MPHelpers.createUniqueDir(__dirname);

		const { filePath, fileName } = await MPHelpers.createFile(res, dirPath);

		const metadata = await MPHelpers.getFileMetadata(filePath);

		const metadataForPublishing = {
			general: {
				name: fileName,
				type_readable: fileType,
				extension: fileExtension,
				size_bytes: contentSizeBytes,
			},
			metadata: metadata.streams,
		};

		await this.amqpConnection.managedChannel.assertQueue('media:aggregate');
		await this.amqpConnection.managedChannel.bindQueue('media:aggregate', 'exchange1', 'media:aggregate');
		this.amqpConnection.publish('exchange1', 'media:aggregate', metadataForPublishing);

		switch (fileType) {
			case FileType.IMAGE:
				this.processImage(filePath);
				break;
			case FileType.VIDEO:
				this.processVideo(filePath);
				break;
			case FileType.AUDIO:
				this.processAudio(filePath);
		}
	}
}

export { MediaProcessorService };
