import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ProcessMediaDto } from './media.dto';
import {ClientProxyFactory, Transport} from '@nestjs/microservices';
import {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PASS,
	RABBIT_MQ_PORT, RABBIT_MQ_QUEUE_NAME,
	RABBIT_MQ_USER
} from '../../../config';

describe('MediaController', () => {
	let mediaController: MediaController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [MediaController],
			providers: [
				{
					provide: 'RABBIT_MQ_SERVICE',
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASS}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`],
								queue: RABBIT_MQ_QUEUE_NAME,
								queueOptions: {
									durable: false,
								},
							},
						})
					},
				}
			],
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
