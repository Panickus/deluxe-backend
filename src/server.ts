// src/server.ts
import app from './app';
import dotenv from 'dotenv';
import { sequelize } from './models/index'; // Importar la instancia de Sequelize
import defineRelations from './models/relations'; // Importar la función para definir relaciones
import User from './models/user';
import Cart from './models/cart';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate(); // Probar la conexión a la base de datos
    console.log('Conexión exitosa a la base de datos.');

    // Definir relaciones entre modelos
    defineRelations();

    // Sincronizar los modelos con la base de datos
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1); // Salir con código de error
  }
}

startServer(); // Iniciar el servidor
