import {createClient} from 'redis'
class RedisClient {
	constructor() {
		this.client = createClient();

		this.client.on('error', (err) => {
			console.log(`Redis client not connected to server: ${error}`);
		});
	}
	isAlive() {
		if (this.client.connected) {
			return true;
		}
		return false;
	}
	async get (key) {
		try {
			return await this.client.get(key)
		}catch(error) {
			console.error(`Error getting value for key ${key}: ${error}`);
			return null;
		}
	}
	async set (key, value, duration) {
		try {
			return await this.client.set(key, value, duration)
		}catch(error) {
			console.error(`Error setting value for key ${key}: ${error}`);
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
