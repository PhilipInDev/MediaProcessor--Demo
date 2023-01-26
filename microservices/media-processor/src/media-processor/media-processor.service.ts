import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { ErrorMessage, FileType } from './enum';
import { MediaProcessorPayload } from './type';
import { supportedMediaTypesConfig } from './supported-media-types.config';
import { MPHelpers } from './media-processor.helpers';
import { MAX_FILE_SIZE_MB } from '../../config';
import { OCRService } from '../ocr';
import { Exception, PerformanceMeasurement } from '../classes';
import { SpeechRecognitionService } from '../speech-recognition';

const extractFrames = require('ffmpeg-extract-frames');

@Injectable()
class MediaProcessorService {
	constructor(
		private readonly ocrService: OCRService,

		private readonly speechRecognitionService: SpeechRecognitionService,

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

	private async processVideo(filePath: string, dirPath: string, langForOCR: string) {
		await extractFrames(
			{
				input: filePath,
				output: join(dirPath, 'frame-%d.jpg'),
				fps: 1,
				ffmpegPath
			}
		)

		let counter = 1;
		const videoOcrResult = [];
		const getFramePath = (frameNumber: number) => join(dirPath, `frame-${frameNumber}.jpg`);

		while (existsSync(getFramePath(counter))) {
			const ocrResult = await this.processImage(getFramePath(counter), langForOCR);
			videoOcrResult.push(`------------------${counter} second------------------>\n ${ocrResult}`);
			counter++;
		}

		return videoOcrResult.join('-------------------- END --------------------\n\n');
	}

	private async processAudio(filePath: string) {
		console.log('process audio')
		return this.speechRecognitionService.recognize(filePath);
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
		langForOCR,
		dirPath,
 	} : {
		fileType: FileType;
		filePath: string;
		dirPath: string;
		langForOCR: string;
	}) {
		let ocrResult: string | null = null;
		let audioRecognitionResult: string | null = null;

		switch (fileType) {
			case FileType.IMAGE:
				ocrResult = await this.processImage(filePath, langForOCR);
				break;
			case FileType.VIDEO:
				ocrResult = await this.processVideo(filePath, dirPath, langForOCR);
				break;
			case FileType.AUDIO:
				audioRecognitionResult = await this.processAudio(filePath);
		}

		return { ocrResult, audioRecognitionResult };
	}

	async processFile({ operationKey, file: { fileUrl, langForOCR } } : MediaProcessorPayload) {
		const cleanup = async (dirPath: string) => rm(dirPath, { recursive: true, force: true });

		try {
			await this.scanContentForExceptions({ fileUrl, langForOCR });

			const uploadingFileStartTime = PerformanceMeasurement.getStartTime();
			const {
				filePath,
				fileName,
				fileType,
				fileExtension,
				fileSizeBytes,
				dirPath,
			} = await MPHelpers.getFileByURL(fileUrl);
			const uploadingFileElapsedTime = PerformanceMeasurement
				.getElapsedTimeMs(process.hrtime(uploadingFileStartTime));

			try {

				const metadataRetrievingStartTime = PerformanceMeasurement.getStartTime();
				const metadata = await MPHelpers.getFileMetadata(filePath);
				const metadataRetrievingElapsedTime = PerformanceMeasurement
					.getElapsedTimeMs(process.hrtime(metadataRetrievingStartTime));

				const fileHash = await MPHelpers.getFileHash(filePath);

				const fileSpecificProcessingStartTime = PerformanceMeasurement.getStartTime();
				const {
					ocrResult,
					audioRecognitionResult,
				} = await this.makeFileSpecificProcessing({
					fileType,
					filePath,
					langForOCR,
					dirPath,
				})
				const fileSpecificProcessingElapsedTime = PerformanceMeasurement
					.getElapsedTimeMs(process.hrtime(fileSpecificProcessingStartTime));

				const dataForAggregation = {
					operationKey,
					general: {
						name: fileName,
						typeReadable: fileType,
						extension: fileExtension,
						sizeBytes: fileSizeBytes,
						hash: fileHash,
					},
					metadata: metadata.streams,
					ocrResult,
					audioRecognitionResult,
					performance: {
						fileSpecificProcessingMs: fileSpecificProcessingElapsedTime,
						metadataRetrievingMs: metadataRetrievingElapsedTime,
						uploadingFileMs: uploadingFileElapsedTime,
					}
				};

				await cleanup(dirPath);

				await MPHelpers.publishIntoQueue(
					this.amqpConnection,
					dataForAggregation,
					{ queueName: 'media:aggregate', exchange: 'exchange1', routingKey: 'media:aggregate' }
				)

			} catch (e) {
				await cleanup(dirPath);
				throw e;
			}

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
