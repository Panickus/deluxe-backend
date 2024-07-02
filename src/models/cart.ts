import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user'; // Asegúrate de importar el modelo User aquí

interface CartAttributes {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number; // Debe ser del mismo tipo que User.id
}

class Cart extends Model<CartAttributes> {
  public id!: number;
  public nombre!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public userId!: number;

  // Define las relaciones de Sequelize aquí
}

Cart.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // O como sea apropiado para tu caso
    references: {
      model: User, // Referencia al modelo User
      key: 'id',   // Clave primaria que se está referenciando
    },
    onDelete: 'SET NULL', // O la acción de borrado que desees
    onUpdate: 'CASCADE',  // Acción de actualización deseada
  },
}, {
  sequelize,
  modelName: 'Cart',
});

export default Cart;
