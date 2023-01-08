import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'file_metadata' } )
class FileMetadataModel extends Model<FileMetadataModel> {

	@Column
	file_id: string; // one to one with id of the item in the file_general table

	@Column
	duration_ms: number | null;

	@Column
	resolution: string | null;

	@Column
	width: number | null;

	@Column
	height: number | null;

	@Column
	codec_name: string | null;

	@Column
	codec_long_name: string | null;

	@Column
	codec_type: string | null;

	@Column
	aspect_ratio: string | null;

}

export { FileMetadataModel };
