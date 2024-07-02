// src/controllers/userController.ts

import { Request, Response } from 'express';
import User from '../models/user';
import Order from '../models/order';
import Product from '../models/product';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const userController = {
  register: async (req: Request, res: Response) => {
    const { nombre, email, password, telefono, direccion } = req.body;

    try {
      // Verificar si el email ya está registrado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      await User.create({
        nombre,
        email,
        password: hashedPassword,
        telefono,
        direccion,
        rol: 'cliente', // Por defecto, el rol es 'cliente'
        fechaRegistro: new Date(), // Asegúrate de proporcionar la fecha de registro
      });

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  },


  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Buscar el usuario por email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // Obtener el ID del usuario del token JWT

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // No enviar la contraseña en la respuesta
      const { password, ...userData } = user.toJSON();
      res.json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // Obtener el ID del usuario del token JWT
    const { nombre, telefono, direccion } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar los campos permitidos
      user.nombre = nombre;
      user.telefono = telefono;
      user.direccion = direccion;
      await user.save();

      res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el perfil del usuario' });
    }
  },

  getOrders: async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
      const orders = await Order.findAll({
        where: { userId }, // Filtrar por el ID del usuario
        include: [Product], // Incluir los productos asociados a cada pedido
      });

      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
  },
};

export default userController;
