import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';

class AuthController {
	static async getConnect(request, res) {
		//const authHeader = request.headers['Authorization'] || '';
		//console.log(`authHeader: ${authHeader}`)
		const authHeader = request.get('Authorization') || '';
		if (!authHeader || !authHeader.startsWith('Basic ')) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		//console.log(`authHeader: ${authHeader}`);
		const base64Credentials = authHeader.split(' ')[1];
		const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
		const [email, password] = decodedCredentials.split(':');
		if (!email || !password) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		//console.log(`email: ${email}`);
		//console.log(`password: ${password}`);
		const hashedPassword = sha1(password);
		//console.log(`hashedPassword: ${hashedPassword}`);
		try {
			const user = await dbClient.users.findOne({ email, password: hashedPassword });
			//console.log(`user: ${user}`);
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			const token = uuidv4();
			const redisKey = `auth_${token}`;
			const timeToexpire = 24;
			await redisClient.set(redisKey, user._id.toString(), timeToexpire * 3600);
			return res.status(200).json({ token });
		} catch (err) {
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	}

	// disconnects a user based on key
	static async getDisconnect(request, res) {
		const token = request.headers['x-token'];
		const user = await redisClient.get(`auth_${token}`);
		if (!user) return res.status(401).json({ error: 'Unauthorized' });
		await redisClient.del(`auth_${token}`);
		return res.status(204).end();
	}
}
export default AuthController;
