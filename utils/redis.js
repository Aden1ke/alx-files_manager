import { createClient } from 'redis';

import { promisify } from 'util';

class RedisClient {
	constructor() {
		this.client = createClient();
		this.client.on('error', (error) => {
			console.log(`Redis client not connected to server: ${error}`);
		});
	}

	isAlive() {
		if (this.client.connected) {
			return true;
		}
		return false;
	}

	async get(key) {
		const getRedis = promisify(this.client.get).bind(this.client);
		const value = await getResdis(key);
		return value;
	}

	async set(key, value, time) {
		const setRedis = promisify(this.client.set).bind(this.client);
		await setRedis(key, value);
		await this.client.expire(key, time);
	}

	async del(key) {
		const delRedis = promisify(this.client.del).bind(this.client);
		await delRedis(key);
	}
}

const redisClient = new RedisClient();

module.exports = redisClient;
