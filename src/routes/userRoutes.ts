import express from 'express';
import userController from '../controllers/userController';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);
router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, userController.updateProfile);
router.get('/orders', authMiddleware.authenticate, userController.getOrders);

export default router;
