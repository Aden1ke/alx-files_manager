//import crypto from 'crypto';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
	static async postNew(req, res) {
		const { email, password } = req.body;
		if (!email) {
			return res.status(400).json({ error: 'Missing email' });
		}
		if (!password) {
			return res.status(400).json({ error: 'Missing password' });
		}
		//console.log(`email: ${ email } password: ${ password }`);
		// query check if user already exist in the database
		const userExists = await dbClient.users.findOne({ email });
		if (userExists) {
			return res.status(400).json({ error: 'Already exist' });
		}

		const passHashed = sha1(password);
		//save user
		let result;
		try {
			result = await dbClient.users.insertOne({ 
				email, password: passHashed,
			});
		} catch (err) {
			return res.status(500).json({ error: 'Error creating user' });
		}

		return res.status(201).json({
			id: result.insertedId,
			email: email
		});
	}

	static async getMe(req, res) {
		const token = req.header('X-Token');
		if (!token) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		try {
			// retrieve user_id from redisClient
			const userId = await redisClient.get(`auth_${token}`);
			if (!userId) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			// retrieve user details from mongoDB
			const user = await dbClient.users.findOne({ _id: userId });
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			return res.status(200).json({
				id: user._id.toString(),
				email: user.email,
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({error: 'Internal Server Error'});
		}
	}
}

export default UsersController;
