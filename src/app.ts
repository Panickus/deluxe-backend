import express from 'express';
import cors from 'cors';
import csurf from 'csurf';
import productRoutes from './routes/productRoutes';
import userController from './controllers/userController';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(express.json());
app.use(csurf({ cookie: true })); // Protección CSRF
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/productos', productRoutes); 
app.use('/usuarios', userRoutes);
app.use('/pedidos', orderRoutes);

export default app;
