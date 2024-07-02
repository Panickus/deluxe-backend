// src/models/cartItemModel.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Cart from './cart';
import Product from './product';

interface CartItemAttributes {
    id: number;
    cartId: number;
    productId: number;
    cantidad: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> {
    public id!: number;
    public cartId!: number;
    public productId!: number;
    public cantidad!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cart,
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
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
    },
    {
        sequelize,
        modelName: 'CartItem',
    }
);


export default CartItem;

