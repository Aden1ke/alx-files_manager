import {createClient} from 'redis'
class RedisClient {
	constructor() {
		this.client = createClient();
		this.client.on('error', (err) => {
			console.log(`Redis client not connected to server: ${error}`);
		});
		this.client.connect().catch(console.error);
	}

	isAlive() {
		if (this.client.ping) {
			return true;
		}
		return false;
	}

	async get (key) {
		try {
			return await this.client.get(key)
		}catch(error) {
			return null;
		}
	}
	async set(key, value, duration) {
		try {
			await this.client.set(key, value.toString(), {
				EX: duration
			});
		} catch (error) {
			console.error(`Error setting key ${key}: ${error}`);
		}
	}

	async del (key) {
		try {
			return await this.client.del(key)
		}catch(error) {
			console.error(`Error deleting key ${key}: ${error}`);
		}
	}
}
const redisClient = new RedisClient();
export default redisClient;
