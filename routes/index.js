import express from 'express';
import AppController from '../controllers/AppController';
import FilesController from '../controllers/FilesController';


const router = express.Router();

// the get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/files', FilesController.postUpload);



module.exports = router;
