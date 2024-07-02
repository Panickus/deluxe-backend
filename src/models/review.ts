// src/models/reviewModel.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './product';
import User from './user';

interface ReviewAttributes {
  id: number;
  comentario: string;
  puntuacion: number;
  userId: number;
  productId: number;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  public id!: number;
  public comentario!: string;
  public puntuacion!: number;
  public userId!: number; // Clave foránea para la relación con User
  public productId!: number; // Clave foránea para la relación con Product

  public readonly createdAt!: Date; // Asegura que createdAt sea de solo lectura
  public readonly updatedAt!: Date; // Asegura que updatedAt sea de solo lectura
}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Review',
});


export default Review;
