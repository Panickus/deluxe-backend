import { Request, Response } from 'express';
import { Op, Transaction, QueryTypes } from 'sequelize'; // Asegúrate de importar QueryTypes
import Order from '../models/order';
import OrderDetail from '../models/orderDetail';
import Product from '../models/product';
import CartItem from '../models/cartItem';
import sequelize from '../config/database';

interface OrderController {
  createOrder: (req: Request, res: Response) => Promise<void>;
  getOrderById: (req: Request<{ id: string }>, res: Response) => Promise<void>;
  getAllOrders: (req: Request, res: Response) => Promise<void>;
  updateOrder: (req: Request<{ id: string }>, res: Response) => Promise<void>;
  cancelOrder: (req: Request<{ id: string }>, res: Response) => Promise<void>;
}

const orderController: OrderController = {
  createOrder: async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { cartItems, direccionEnvio, metodoPago } = req.body;

    let transaction: Transaction | null = null;

    try {
      transaction = await sequelize.transaction();

      // Calcular el total del pedido y verificar el stock
      let total = 0;
      for (const item of cartItems) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        if (product.stock < item.cantidad) {
          throw new Error(`No hay suficiente stock para el producto: ${product.nombre}`);
        }
        total += product.precio * item.cantidad;

        // Actualizar el stock del producto
        product.stock -= item.cantidad;
        await product.save({ transaction });
      }

      // Crear el pedido
      const order = await Order.create({
        userId,
        fecha: new Date(),
        total,
        direccionEnvio,
        metodoPago,
        estado: 'pendiente',
      }, { transaction });

      // Crear los detalles del pedido
      for (const item of cartItems) {
        await OrderDetail.create({
          orderId: order.id,
          productId: item.productId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        }, { transaction });
      }

      await transaction.commit();
      res.status(201).json(order);
    } catch (error: any) {
      if (transaction) await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: error.message || 'Error al crear el pedido' });
    }
  },

  getOrderById: async (req: Request<{ id: string }>, res: Response) => {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user.id;

    try {
      const order = await Order.findOne({
        where: { id: orderId, userId },
        include: [{
          model: OrderDetail,
          include: [Product],
        }],
      });

      if (!order) {
        res.status(404).json({ message: 'Pedido no encontrado' });
      } else {
        res.json(order);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el pedido' });
    }
  },

  getAllOrders: async (req: Request, res: Response): Promise<void> => {
    const isAdmin = (req as any).user.rol === 'admin';
    if (!isAdmin) {
      res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      return;
    }

    try {
      const results: any[] = await sequelize.query(`
        SELECT
          orders.*,
          cartItems.cantidad,
          cartItems.precioUnitario,
          products.id AS "productId",
          products.nombre AS "productName",
          products.precio AS "productPrecio",
          products.imagen AS "productImagen"
        FROM orders
        JOIN cartItems ON orders.id = cartItems.orderId
        JOIN products ON cartItems.productId = products.id
      `, { type: QueryTypes.SELECT }); // Usa QueryTypes.SELECT aquí

      if (!results || results.length === 0) {
        res.status(404).json({ message: 'No se encontraron pedidos' });
        return;
      }

      // Agrupar los resultados por orderId
      const formattedOrders = results.reduce((acc: Record<number, any>, row: any) => {
        const orderId = row.id;
        if (!acc[orderId]) {
          acc[orderId] = { ...row, items: [] };
        }
        acc[orderId].items.push({
          product: {
            id: row.productId,
            nombre: row.productName,
            precio: row.productPrecio,
            imagen: row.productImagen
          },
          cantidad: row.cantidad,
          precioUnitario: row.precioUnitario
        });
        return acc;
      }, {});

      res.json(Object.values(formattedOrders)); // Convertir el objeto en un array
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
  },

  updateOrder: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const orderId = parseInt(req.params.id);
    const isAdmin = (req as any).user.rol === 'admin';
    if (!isAdmin) {
      res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      return;
    }

    const { estado } = req.body;

    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        res.status(404).json({ message: 'Pedido no encontrado' });
        return;
      }

      order.estado = estado;
      await order.save();
      res.json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
  },

  cancelOrder: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user.id;

    try {
      const order = await Order.findOne({
        where: { id: orderId, userId },
        include: [{
          model: OrderDetail,
          include: [Product],
        }],
      });
      if (!order) {
        res.status(404).json({ message: 'Pedido no encontrado' });
        return;
      }

      if (order.estado !== 'pendiente') {
        res.status(400).json({ message: 'No puedes cancelar un pedido que no está pendiente' });
        return;
      }

      const transaction = await sequelize.transaction();
      try {
        order.estado = 'cancelado';
        await order.save({ transaction });

        // Verificar si order.orderDetails está definido antes de iterar sobre él
        if (order.orderDetails) {
          for (const orderDetail of order.orderDetails) {
            const product = await Product.findByPk(orderDetail.productId, { transaction });
            if (product) {
              product.stock += orderDetail.cantidad;
              await product.save({ transaction });
            }
          }
        }

        await transaction.commit();
        res.json({ message: 'Pedido cancelado correctamente' });
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error al cancelar el pedido' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el pedido' });
    }
  },
};

export default orderController;
