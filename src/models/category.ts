import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Category extends Model {
  public id!: number;
  public nombre!: string;
  public descripcion?: string; // Opcional
  public imagen?: string; // Opcional: URL de la imagen de la categoría
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegurar que los nombres de categoría sean únicos
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  imagen: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Category',
});

export default Category;
