import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
<<<<<<< HEAD
import FilesController from '../controllers/FilesController';
=======
>>>>>>> 4de7224ea2e099f91295b5a3acd495bba22588d8

const router = express.Router();

// the get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/Users/me', UsersController.getMe);
<<<<<<< HEAD
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);
=======
>>>>>>> 4de7224ea2e099f91295b5a3acd495bba22588d8

//post routes
router.post('/users', UsersController.postNew);

module.exports = router;
