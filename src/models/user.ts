import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Order from './order';

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: string;
  telefono: string;
  direccion: string;
  nombreFacturacion?: string;
  nif?: string;
  direccionFacturacion?: string;
  direccionesEnvio?: JSON;
  fechaNacimiento?: Date;
  genero?: string;
  avatar?: string;
  preferencias?: JSON;
  suscripciones?: JSON;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public rol!: string;
  public telefono!: string;
  public direccion!: string;
  public nombreFacturacion?: string;
  public nif?: string;
  public direccionFacturacion?: string;
  public direccionesEnvio?: JSON;
  public fechaNacimiento?: Date;
  public genero?: string;
  public avatar?: string;
  public preferencias?: JSON;
  public suscripciones?: JSON;
  public fechaRegistro!: Date;
  public ultimoAcceso?: Date;

  // Propiedad para incluir las asociaciones en las instancias de User
  public readonly orders?: Order[];
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'cliente'),
    allowNull: false,
    defaultValue: 'cliente',
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombreFacturacion: {
    type: DataTypes.STRING,
  },
  nif: {
    type: DataTypes.STRING,
  },
  direccionFacturacion: {
    type: DataTypes.STRING,
  },
  direccionesEnvio: {
    type: DataTypes.JSON,
  },
  fechaNacimiento: {
    type: DataTypes.DATE,
  },
  genero: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  preferencias: {
    type: DataTypes.JSON,
  },
  suscripciones: {
    type: DataTypes.JSON,
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ultimoAcceso: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'User',
});

export default User;
