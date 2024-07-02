import { Cart, CartItem, Category, Order, OrderDetail, Product, Review, User } from './index';

function defineRelations() {
    // Relaciones User
    User.hasMany(Cart, { foreignKey: 'userId' });
    User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
    User.hasMany(Review, { foreignKey: 'userId' });

    // Relaciones Product
    Product.hasMany(CartItem, { foreignKey: 'productId' });
    Product.hasMany(OrderDetail, { foreignKey: 'productId', as: 'orderDetails' });
    Product.hasMany(Review, { foreignKey: 'productId' });

    // Relaciones Order
    Order.belongsTo(User, { foreignKey: 'userId' });
    Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'orderDetails' });
    Order.hasMany(CartItem, { foreignKey: 'orderId', as: 'CartItems' });

    // Relaciones Cart
    Cart.belongsTo(User, { foreignKey: 'userId' });
    Cart.hasMany(CartItem, { foreignKey: 'cartId' });

    // Relaciones CartItem
    CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
    CartItem.belongsTo(Product, { foreignKey: 'productId' });

    // Relaciones OrderDetail
    OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });
    OrderDetail.belongsTo(Product, { foreignKey: 'productId' });

    // Relaciones Review
    Review.belongsTo(User, { foreignKey: 'userId' });
    Review.belongsTo(Product, { foreignKey: 'productId' });
}

export default defineRelations;
