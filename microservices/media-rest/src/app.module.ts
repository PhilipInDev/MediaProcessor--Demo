import { Module } from '@nestjs/common';
import { MediaModule } from './api';
import { SequelizeModule } from '@nestjs/sequelize';
import {
	DB_DIALECT,
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_PORT,
	DB_USER
} from '../config';
import { Dialect } from './common';

@Module({
	imports: [
		MediaModule,
		SequelizeModule.forRoot({
			dialect: DB_DIALECT as Dialect,
			host: DB_HOST,
			port: Number(DB_PORT),
			username: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			models: [],
			autoLoadModels: true,
			synchronize: true,
		})
	],
})
class AppModule {}

export { AppModule };
