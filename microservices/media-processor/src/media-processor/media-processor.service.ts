import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { rmSync } from 'fs';
import { ErrorMessage } from './error-message.enum';
import { FileType } from './file-types.enum';
import { supportedMediaTypesConfig } from './supported-media-types.config';
import { MPHelpers } from './media-processor.helpers';
import { MAX_FILE_SIZE_MB } from '../../config';
import { OCRService } from '../ocr';
import { MediaProcessorPayload } from './media-processor.type';
import { Exception } from '../classes';

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
			throw new Exception({
				message: `Language «${langForOCR}» is not supported. Supported languages for OCR: ${this.ocrService.supportedLanguages.join(', ')}`,
			});
		}

		if (!supportedMediaTypesConfig.includes(contentType)) {
			throw new Exception({
				message: `${ErrorMessage.CONTENT_TYPE_IS_NOT_SUPPORTED}. File type is: ${contentType}. Supported types: ${supportedMediaTypesConfig.join(', ')}.`,
			});
		}

		if (this.MAX_FILE_SIZE_MB < contentSizeMb) {
			throw new Exception({
				message: `${ErrorMessage.CONTENT_SIZE_IS_TOO_LARGE}. Max content size is ${this.MAX_FILE_SIZE_MB}MB`,
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

	private async makeFileSpecificProcessing({
		fileType,
		filePath,
		langForOCR
 	} : {
		fileType: FileType;
		filePath: string;
		langForOCR: string
	}) {
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

		return { ocrResult, audioRecognitionResult };
	}

	async processFile({ operationKey, file: { fileUrl, langForOCR } } : MediaProcessorPayload) {
		try {
			await this.scanContentForExceptions({ fileUrl, langForOCR });

			const res = await fetch(fileUrl);

			const { contentType, contentSizeBytes } = MPHelpers.getFileMetadataByHttpHeaders(res.headers);

			const fileType = MPHelpers.getFileType(contentType);

			const fileExtension = MPHelpers.getFileExtension(contentType)

			const dirPath = MPHelpers.createUniqueDir(__dirname);

			const { filePath, fileName } = await MPHelpers.createFile(res, dirPath);

			const metadata = await MPHelpers.getFileMetadata(filePath);

			const fileHash = await MPHelpers.getFileHash(filePath);

			const {
				ocrResult,
				audioRecognitionResult,
			} = await this.makeFileSpecificProcessing({
				fileType,
				filePath,
				langForOCR,
			})

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
		} catch (e: unknown) {

			if (e instanceof Exception) {
				await MPHelpers.publishIntoQueue(
					this.amqpConnection,
					{ operationKey, error: e },
					{
						queueName: 'media:process:error',
						exchange: 'exchange1',
						routingKey: 'media:process:error'
					}
				)
			}

		}
	}

	getSupportedOCRLanguages() {
		return {
			supportedLanguages: this.ocrService.supportedLanguages,
		};
	}
}

export { MediaProcessorService };
