import express from 'express';
import cartController from '../controllers/cartController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware.authenticate, cartController.getCart);
router.post('/add', authMiddleware.authenticate, cartController.addProductToCart);
router.delete('/remove/:productId', authMiddleware.authenticate, cartController.removeProductFromCart);
router.put('/update/:productId', authMiddleware.authenticate, cartController.updateCartItemQuantity);
router.delete('/clear', authMiddleware.authenticate, cartController.clearCart);

export default router;
