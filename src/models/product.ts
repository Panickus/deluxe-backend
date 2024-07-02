// src/models/productModel.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Category from './category'; 
import Order from './order';
import CartItem from './cartItem';

class Product extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public precio!: number;
  public stock!: number; 
  public imagen?: string; 
  public categoria?: string; 
  public marca?: string; 
  public descuento?: number; 
  public destacado?: boolean; 

  // Relación con la categoría
  public categoryId!: number;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0, // El precio no puede ser negativo
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0, // El stock no puede ser negativo
    },
  },
  imagen: {
    type: DataTypes.STRING,
  },
  categoria: { // Puedes usar este campo si quieres almacenar el nombre de la categoría directamente en el producto (redundante)
    type: DataTypes.STRING,
  },
  marca: {
    type: DataTypes.STRING,
  },
  descuento: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 100, // El descuento no puede ser mayor al 100%
    },
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  categoryId: { // Clave foránea para la relación con Category
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category, 
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Product',
});



export default Product;
