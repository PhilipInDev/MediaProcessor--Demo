import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'file_general' })
class FileGeneralModel extends Model<FileGeneralModel> {

	@Column
	name: string;

	@Column
	size_bytes: number;

	@Column
	extension: string;

	@Column
	type_readable: string;

	@Column
	hash: string;

}

export { FileGeneralModel };
