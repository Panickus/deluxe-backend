import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './product';
import Order from './order';

interface OrderDetailAttributes {
  id: number;
  orderId: number;
  productId: number;
  cantidad: number;
  precioUnitario: number;
}

interface OrderDetailCreationAttributes extends Optional<OrderDetailAttributes, 'id'> {}

class OrderDetail extends Model<OrderDetailAttributes, OrderDetailCreationAttributes> {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public cantidad!: number;
  public precioUnitario!: number;
}

OrderDetail.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
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
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Asegurar que la cantidad sea al menos 1
    },
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'OrderDetail',
});



export default OrderDetail;
