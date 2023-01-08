import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { FileMetadata } from '../../common';
import { FileGeneralModel, FileMetadataModel } from '../../database';

@Injectable()
class MediaService {

	constructor(
		@InjectModel(FileMetadataModel)
		private fileMetadataModel: typeof FileMetadataModel,

		@InjectModel(FileGeneralModel)
		private fileGeneralModel: typeof FileGeneralModel,

		private amqpConnection: AmqpConnection
	) {}

	async processFile(data): Promise<{ error?: string | null, statusCode: HttpStatus }> {
		await this.amqpConnection.managedChannel.assertQueue('media:process');
		await this.amqpConnection.managedChannel.bindQueue('media:process', 'exchange1', 'media:process');

		return this.amqpConnection.request({
			exchange: 'exchange1',
			routingKey: 'media:process',
			payload: data,
		});
	}

	async aggregateFileMetadata({ general, metadata } : FileMetadata) {
		const fileGeneral = await this.fileGeneralModel.create({
			name: general.name,
			type_readable: general.type_readable,
			extension: general.extension,
			size_bytes: general.size_bytes,
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
}

export { MediaService };
