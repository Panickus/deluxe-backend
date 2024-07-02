import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user';
import CartItem from './cartItem';
import OrderDetail from './orderDetail';

interface OrderAttributes {
  id: number;
  fecha: Date;
  estado: string;
  total: number;
  direccionEnvio: string;
  metodoPago: string;
  detallesPago?: JSON;
  userId: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  public id!: number;
  public fecha!: Date;
  public estado!: string;
  public total!: number;
  public direccionEnvio!: string;
  public metodoPago!: string;
  public detallesPago?: JSON;
  public userId!: number;

  // Propiedad para incluir las asociaciones en las instancias de Order
  public readonly orderDetails?: OrderDetail[];
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'completado', 'cancelado'),
    defaultValue: 'pendiente',
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  direccionEnvio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metodoPago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detallesPago: {
    type: DataTypes.JSON,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Order',
});

export default Order;
