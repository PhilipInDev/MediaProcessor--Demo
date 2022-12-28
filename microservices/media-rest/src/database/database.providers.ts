import { Sequelize } from 'sequelize-typescript';
import { FileMetadata } from './file-metadata';
import {
	DB_DIALECT,
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_PORT,
	DB_USER
} from '../../config';
import { Dialect } from '../common';

const databaseProviders = [
	{
		provide: 'SEQUELIZE',
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: DB_DIALECT as Dialect,
				host: DB_HOST,
				port: Number(DB_PORT),
				username: DB_USER,
				password: DB_PASS,
				database: DB_NAME,
			});
			sequelize.addModels([FileMetadata]);
			await sequelize.sync();
			return sequelize;
		},
	},
];

export { databaseProviders };
