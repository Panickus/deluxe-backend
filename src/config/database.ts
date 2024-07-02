// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import defineRelations from '../models/relations'; // Importamos la función

dotenv.config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST!,
  dialect: 'mysql',
  database: process.env.DB_DATABASE!, // Asegúrate de especificar la base de datos aquí
  port: parseInt(process.env.DB_PORT!, 10),
});

export default sequelize;