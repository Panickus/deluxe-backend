// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const authMiddleware = {
  authenticate: (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization'); // Obtener el token del encabezado Authorization

    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
    }

    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!); // Verificar y decodificar el token
      // Aquí puedes agregar lógica para verificar roles o permisos del usuario, si es necesario
      (req as any).user = decoded; // Asignar el usuario decodificado a la solicitud (req)
      next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
      res.status(401).json({ error: 'Token inválido.' });
    }
  },
};

export default authMiddleware;
