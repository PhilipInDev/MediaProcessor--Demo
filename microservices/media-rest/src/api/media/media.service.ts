import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { randomUUID } from 'crypto'
import { MediaGateway } from './media.gateway';
import { MediaHelpers } from './media.helpers';
import { ProcessMediaDtoArray } from './media.dto';
import { WebSocketResponse } from '../../classes';
import { FileProcessingResult } from '../../common';
import { FileGeneralModel, FileMetadataModel } from '../../database';

@Injectable()
class MediaService {

	constructor(
		@InjectModel(FileMetadataModel)
		private fileMetadataModel: typeof FileMetadataModel,

		@InjectModel(FileGeneralModel)
		private fileGeneralModel: typeof FileGeneralModel,

		private amqpConnection: AmqpConnection,

		private mediaGateway: MediaGateway
	) {}

	async processFile({ files }: ProcessMediaDtoArray) {
		const hasDuplicates = MediaHelpers.hasDuplicates(files.map(({ id, ...rest }) => rest));

		if (hasDuplicates) {
			throw new HttpException('Request shouldn\'t contain duplicates', HttpStatus.BAD_REQUEST);
		}

		const pendingOperations = files.map(async (file) => {
			const operationKey = randomUUID();

			await MediaHelpers.publishIntoQueue(
				this.amqpConnection,
				{
					operationKey,
					file,
				},
				{
					exchange: 'exchange1',
					routingKey: 'media:process',
					queueName: 'media:process'
				}
			);

			return { id: file.id, fileUrl: file.fileUrl, operationKey };
		})

		return Promise.all(pendingOperations);
	}

	async aggregateFileInfo({
		operationKey,
		general,
		metadata,
		ocrResult,
		performance,
	} : FileProcessingResult) {
		const fileGeneral = await this.fileGeneralModel.create({
			name: general.name,
			type_readable: general.typeReadable,
			extension: general.extension,
			size_bytes: general.sizeBytes,
			hash: general.hash,
		})

		const metadataItems = metadata.map((meta) => ({
			file_id: fileGeneral.id,
			duration_ms: meta.duration
				? Number((Number(meta.duration) * 1000).toFixed(0)) // duration in seconds to ms
				: null,
			aspect_ratio: meta.display_aspect_ratio,
			width: meta.width,
			height: meta.height,
			codec_name: meta.codec_name,
			codec_type: meta.codec_type,
			codec_long_name: meta.codec_long_name,
			resolution: meta.width ? `${meta.width} x ${meta.height}` : null,
		}));

		console.log('aggregate-service:data', fileGeneral.id, metadataItems)
		console.log('ocr', ocrResult, operationKey, performance)

		this.mediaGateway.server.emit(
			operationKey,
			new WebSocketResponse({
				fileGeneral,
				metadata: metadataItems,
				ocrResult,
				performance,
			})
		);

		await this.fileMetadataModel.bulkCreate(metadataItems);
	}

	async getAggregatedFilesStats() {
		const files = await this.fileGeneralModel.findAll();

		const now = new Date().getTime();
		const oneDayMs = 1000 * 60 * 60 * 24;
		const thirtyDaysMs = oneDayMs * 30;

		const totalSizeBytes = files.reduce((acc, { size_bytes }) => acc + size_bytes, 0);

		const totalCountForPast30days = files.reduce((acc, { createdAt }) => {
			const createdAtMs = new Date(createdAt).getTime();
			if (now - thirtyDaysMs < createdAtMs) {
				return acc + 1;
			}

			return acc;
		}, 0);

		return {
			totalCount: files.length,
			totalSizeBytes,
			totalCountForPast30days,
		};
	}

	async getSupportedOCRLanguages() {
		return MediaHelpers.requestUsingQueue(
			this.amqpConnection,
			null,
			{
				exchange: 'exchange1',
				routingKey: 'media:process:supported-ocr-languages',
				queueName: 'media:process:supported-ocr-languages'
			}
		)
	}

	async handleMediaProcessingError(error: Error, operationKey: string) {
		this.mediaGateway.server.emit(
			operationKey,
			new WebSocketResponse(
				null,
				{ message: error.message, details: error }
			)
		)
	}
}

export { MediaService };
