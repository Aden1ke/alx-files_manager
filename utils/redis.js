import {createClient} from 'redis'
import { promisify } from 'util';
class RedisClient {
	constructor() {
		this.client = createClient();
		this.clientConnected = true;
		this.client.on('error', (error) => {
			console.log(`Redis client not connected to server: ${error}`);
		});
		//this.client.connect().catch(console.error);
		this.client.on('connect', () => {
			this.clientConnected = true;
		});
	}
//	}
	isAlive() {
		if (this.client.ping) {
			return true;
		}
		return false;
	}

	async get(key) {
		try {
			return promisify(this.client.GET).bind(this.client)(key);
			//return await this.client.get(key)
		}catch(error) {
			return null;
		}
	}
	async set(key, value, duration) {
		try {
			await promisify(this.client.SETEX)
				.bind(this.client)(key, duration, value);
			//await this.client.set(key, value.toString(), {
				//EX: duration
			//});
		} catch (error) {
			console.error(`Error setting key ${key}: ${error}`);
		}
	}
	async del(key) {
		try {
			await promisify(this.client.DEL).bind(this.client)(key);
			//return await this.client.del(key)
		}catch(error) {
			console.error(`Error deleting key ${key}: ${error}`);
		}
	}
}
const redisClient = new RedisClient();
export default redisClient;
