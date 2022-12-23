import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ProcessMediaDto } from './media.dto';

describe('MediaController', () => {
	let mediaController: MediaController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [MediaController],
			providers: [MediaService],
		}).compile();

		mediaController = app.get<MediaController>(MediaController);
	});

	describe('POST:media/process', () => {

		describe('DTO test', () => {
			let target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true });
			const metadata: ArgumentMetadata = {
				type: 'body',
				metatype: ProcessMediaDto,
				data: ''
			};

			it('should return validation error when body is empty', () => {
				target.transform({}, metadata)
					.then((data) => expect(data).not.toBeInstanceOf(ProcessMediaDto))
					.catch((err) => expect(err).toBeTruthy());
			})
			it('should return validation error when "fileUrl" is null', () => {
				target.transform({ fileUrl: null }, metadata)
					.then((data) => expect(data).not.toBeInstanceOf(ProcessMediaDto))
					.catch((err) => expect(err).toBeTruthy());
			})
			it('should return validation error when "fileUrl" is object', () => {
				target.transform({ fileUrl: {} }, metadata)
					.then((data) => expect(data).not.toBeInstanceOf(ProcessMediaDto))
					.catch((err) => expect(err).toBeTruthy());
			})
			it('should return validation error when "fileUrl" is number', () => {
				target.transform({ fileUrl: 1 }, metadata)
					.then((data) => expect(data).not.toBeInstanceOf(ProcessMediaDto))
					.catch((err) => expect(err).toBeTruthy());
			})
			it('validation should be passed', () => {
				target.transform({ fileUrl: 'www.google.com' }, metadata)
					.then((data) => expect(data).toBeInstanceOf(ProcessMediaDto))
					.catch((err) => expect(err).toBeFalsy());
			})
		})

	});
});
