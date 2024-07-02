import express from 'express';
import orderController from '../controllers/orderController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware.authenticate, orderController.createOrder);
router.get('/', authMiddleware.authenticate, orderController.getAllOrders); // Solo admins
router.get('/:id', authMiddleware.authenticate, orderController.getOrderById);
router.put('/:id', authMiddleware.authenticate, orderController.updateOrder); // Solo admins
router.delete('/:id', authMiddleware.authenticate, orderController.cancelOrder);

export default router;
