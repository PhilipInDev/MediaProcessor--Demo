import { Table, Column, Model } from 'sequelize-typescript';

@Table
class FileMetadata extends Model {
	@Column
	name: string;

	@Column
	size_kb: number;

	@Column
	extension: string;

	@Column
	length_ms: number | null;

	@Column
	resolution: number | null;
}

export { FileMetadata };

