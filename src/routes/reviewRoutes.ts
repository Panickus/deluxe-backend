import express from 'express';
import reviewController from '../controllers/reviewController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Crear una nueva reseña (requiere autenticación)
router.post('/', authMiddleware.authenticate, reviewController.createReview);

// Obtener todas las reseñas de un producto (no requiere autenticación)
router.get('/product/:productId', reviewController.getReviewsByProduct);

// Actualizar una reseña (requiere autenticación y ser el autor de la reseña)
router.put('/:id', authMiddleware.authenticate, reviewController.updateReview);

// Eliminar una reseña (requiere autenticación y ser el autor de la reseña o ser administrador)
router.delete('/:id', authMiddleware.authenticate, reviewController.deleteReview);

export default router;
