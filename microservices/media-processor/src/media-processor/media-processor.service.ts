import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { rmSync } from 'fs';
import { ErrorMessage } from './error-message.enum';
import { FileType } from './file-types.enum';
import { supportedMediaTypesConfig } from './supported-media-types.config';
import { MPHelpers } from './media-processor.helpers';
import { MAX_FILE_SIZE_MB } from '../../config';
import { OCRService } from '../ocr';
import { MediaProcessorPayload } from './media-processor.type';

@Injectable()
class MediaProcessorService {
	constructor(
		private readonly ocrService: OCRService,

		private readonly amqpConnection: AmqpConnection
	) {}

	private MAX_FILE_SIZE_MB = Number(MAX_FILE_SIZE_MB);

	public async scanContentForExceptions({ fileUrl, langForOCR } : { fileUrl: string, langForOCR?: string }) {
		const { headers: metaHeaders } = await fetch(fileUrl, { method: 'HEAD' });
		const { contentType, contentSizeMb } = MPHelpers.getFileMetadataByHttpHeaders(metaHeaders);

		if (langForOCR && !this.ocrService.supportedLanguages.includes(langForOCR)) {
			throw new RpcException({
				message: `Language «${langForOCR}» is not supported. Supported languages for OCR: ${this.ocrService.supportedLanguages.join(', ')}`,
				statusCode: HttpStatus.BAD_REQUEST,
			});
		}

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

	private async processImage(filePath: string, lang?: string) {
		try {
			return this.ocrService.recognizeTextFromImage(filePath, lang);
		} catch (e) {
			await MPHelpers.publishIntoQueue(
				this.amqpConnection,
				e,
				{ queueName: 'media:process:error', exchange: 'exchange1', routingKey: 'media:process:error' }
			)
		}
	}

	async processFile({ operationKey, file: { fileUrl, langForOCR } } : MediaProcessorPayload) {
		const res = await fetch(fileUrl);

		const { contentType, contentSizeBytes } = MPHelpers.getFileMetadataByHttpHeaders(res.headers);

		const fileType = MPHelpers.getFileType(contentType);

		const fileExtension = MPHelpers.getFileExtension(contentType)

		const dirPath = MPHelpers.createUniqueDir(__dirname);

		const { filePath, fileName } = await MPHelpers.createFile(res, dirPath);

		const metadata = await MPHelpers.getFileMetadata(filePath);

		const fileHash = await MPHelpers.getFileHash(filePath);

		let ocrResult: string | null = null;
		let audioRecognitionResult: string | null = null;

		switch (fileType) {
			case FileType.IMAGE:
				ocrResult = await this.processImage(filePath, langForOCR);
				break;
			case FileType.VIDEO:
				this.processVideo(filePath);
				break;
			case FileType.AUDIO:
				this.processAudio(filePath);
		}

		const dataForAggregation = {
			operationKey,
			general: {
				name: fileName,
				typeReadable: fileType,
				extension: fileExtension,
				sizeBytes: contentSizeBytes,
				hash: fileHash,
			},
			metadata: metadata.streams,
			ocrResult,
			audioRecognitionResult,
		};

		rmSync(filePath);

		await MPHelpers.publishIntoQueue(
			this.amqpConnection,
			dataForAggregation,
			{ queueName: 'media:aggregate', exchange: 'exchange1', routingKey: 'media:aggregate' }
		)
	}
}

export { MediaProcessorService };
