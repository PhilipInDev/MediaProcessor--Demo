import { config } from 'dotenv';

config();

const {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PORT,
	RABBIT_MQ_QUEUE_NAME,
	RABBIT_MQ_USER,
	RABBIT_MQ_PASS,
} = process.env;

export {
	RABBIT_MQ_USER,
	RABBIT_MQ_PASS,
	RABBIT_MQ_HOST,
	RABBIT_MQ_PORT,
	RABBIT_MQ_QUEUE_NAME,
}
