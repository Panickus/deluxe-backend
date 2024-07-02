import { Request, Response } from 'express';
import Review from '../models/review';
import Product from '../models/product';
import User from '../models/user';

const reviewController = {
  createReview: async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { productId, comentario, puntuacion } = req.body;

    try {
      // Verificar si el producto existe
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Crear la reseña
      const review = await Review.create({
        userId,
        productId,
        comentario,
        puntuacion,
      });

      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la reseña' });
    }
  },

  getReviewsByProduct: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId);

    try {
      const reviews = await Review.findAll({
        where: { productId },
        include: [User], // Incluir información del usuario que hizo la reseña
      });
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
  },

  updateReview: async (req: Request, res: Response) => {
    const reviewId = parseInt(req.params.id);
    const userId = (req as any).user.id;
    const { comentario, puntuacion } = req.body;

    try {
      const review = await Review.findOne({ where: { id: reviewId, userId } }); // Asegurarse de que el usuario es el autor
      if (!review) {
        return res.status(404).json({ message: 'Reseña no encontrada' });
      }

      review.comentario = comentario;
      review.puntuacion = puntuacion;
      await review.save();

      res.json({ message: 'Reseña actualizada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la reseña' });
    }
  },

  deleteReview: async (req: Request, res: Response) => {
    const reviewId = parseInt(req.params.id);
    const userId = (req as any).user.id;

    try {
      const review = await Review.findOne({ where: { id: reviewId } });
      if (!review) {
        return res.status(404).json({ message: 'Reseña no encontrada' });
      }

      // Verificar si el usuario es el autor de la reseña o un administrador
      if (review.userId !== userId && (req as any).user.rol !== 'admin') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar esta reseña' });
      }

      await review.destroy();
      res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la reseña' });
    }
  },
};

export default reviewController;
