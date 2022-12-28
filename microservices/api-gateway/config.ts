import { config } from 'dotenv';

config();

const { APIS_HASH_MAP, API_GATEWAY_PORT, API_PREFIX } = process.env;

export { APIS_HASH_MAP, API_GATEWAY_PORT, API_PREFIX }
