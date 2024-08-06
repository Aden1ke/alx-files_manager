const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

class FilesController {
	static async postUpload(req, res) {
		try {
			const token = req.headers['x-token'];
			if (!token) return res.status(401).json({ error: 'Unauthorized' });

			const userId = await redisClient.get(`auth_${token}`);
			if (!userId) return res.status(401).json({ error: 'Unauthorized' });

			const { name, type, parentId = 0, isPublic = false, data } = req.body;

			if (!name) return res.status(400).json({ error: 'Missing name' });
			if (!type || !['folder', 'file', 'image'].includes(type)) {
				return res.status(400).json({ error: 'Missing type' });
			}
			if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

			if (parentId !== 0) {
				const parentFile = await dbClient.collection('files').findOne({ _id: ObjectId(parentId) });
				if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
				if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
			}

			const newFile = {
				userId: ObjectId(userId),
				name,
				type,
				isPublic,
				parentId: parentId === 0 ? '0' : ObjectId(parentId),
				localPath: null,
			};

			if (type !== 'folder') {
				const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
				const filePath = path.join(FOLDER_PATH, uuidv4());

				await mkdir(FOLDER_PATH, { recursive: true });

				await writeFile(filePath, Buffer.from(data, 'base64'));

				newFile.localPath = filePath;
			}

			const result = await dbClient.collection('files').insertOne(newFile);

			return res.status(201).json({
				id: result.insertedId,
				userId: newFile.userId,
				name: newFile.name,
				type: newFile.type,
				isPublic: newFile.isPublic,
				parentId: newFile.parentId,
				localPath: newFile.localPath,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}

module.exports = FilesController;
