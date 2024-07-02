// src/models/index.ts
import sequelize from '../config/database';
import Cart from './cart';
import CartItem from './cartItem';
import Category from './category';
import Order from './order';
import OrderDetail from './orderDetail';
import Product from './product';
import Review from './review';
import User from './user';

// Asocia los modelos a la instancia de Sequelize
Cart.init(Cart.getAttributes(), { sequelize });
CartItem.init(CartItem.getAttributes(), { sequelize });
Category.init(Category.getAttributes(), { sequelize });
Order.init(Order.getAttributes(), { sequelize });
OrderDetail.init(OrderDetail.getAttributes(), { sequelize });
Product.init(Product.getAttributes(), { sequelize });
Review.init(Review.getAttributes(), { sequelize });
User.init(User.getAttributes(), { sequelize });

// Exporta los modelos y la instancia de Sequelize
export {
  sequelize,
  Cart,
  CartItem,
  Category,
  Order,
  OrderDetail,
  Product,
  Review,
  User,
};
