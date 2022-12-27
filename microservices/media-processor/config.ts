import { config } from 'dotenv';

config();

const { RABBIT_MQ_HOST, RABBIT_MQ_PORT, RABBIT_MQ_QUEUE_NAME } = process.env;

export {
	RABBIT_MQ_HOST,
	RABBIT_MQ_PORT,
	RABBIT_MQ_QUEUE_NAME,
}
