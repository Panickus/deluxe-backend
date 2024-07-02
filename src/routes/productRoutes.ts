import express from 'express';
import productController from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import authMiddleware from '../middleware/auth'; // Para proteger rutas de administración

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware.authenticate, validateProduct, productController.createProduct); // Solo admins
router.put('/:id', authMiddleware.authenticate, validateProduct, productController.updateProduct); // Solo admins
router.delete('/:id', authMiddleware.authenticate, productController.deleteProduct); // Solo admins

export default router;
