import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/product';

const productController = {
  getAllProducts: async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Filtros (puedes añadir más filtros según tus necesidades)
    const where: any = {};
    if (req.query.nombre) {
      where.nombre = { [Op.like]: `%${req.query.nombre}%` };
    }
    if (req.query.categoria) {
      where.categoria = req.query.categoria;
    }
    if (req.query.marca) {
      where.marca = req.query.marca;
    }

    try {
      const { count, rows: products } = await Product.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']], // Ordenar por fecha de creación (opcional)
      });
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  },

  getProductById: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el producto' });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    const { nombre, descripcion, precio, stock, imagen, categoria, marca, descuento, destacado } = req.body;

    try {
      const newProduct = await Product.create({
        nombre, descripcion, precio, stock, imagen, categoria, marca, descuento, destacado
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el producto' });
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const { nombre, descripcion, precio, stock, imagen, categoria, marca, descuento, destacado } = req.body;

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Actualiza los campos del producto
      product.nombre = nombre;
      product.descripcion = descripcion;
      product.precio = precio;
      product.stock = stock;
      product.imagen = imagen;
      product.categoria = categoria;
      product.marca = marca;
      product.descuento = descuento;
      product.destacado = destacado;

      await product.save();
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      await product.destroy();
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  },
};

export default productController;
