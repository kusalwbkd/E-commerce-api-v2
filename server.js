import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cloudinary from 'cloudinary';

import productRouter from './routes/productRouter.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import authRouter from './routes/authRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import userRouter from './routes/userRoutes.js';
import salesRouter from './routes/salesRouter.js'
import orderRouter from './routes/OrderRouter.js';
import  notificationRouter from  './routes/noficationRouter.js'
import cookieParser from 'cookie-parser';
import { authenticateUser } from './middleware/authMiddleware.js';
import { createOrder } from './controllers/OrderController.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/orders', authenticateUser, orderRouter);
app.use('/api/v1/notifications', authenticateUser, notificationRouter);
app.use('/api/v1/sales', authenticateUser, salesRouter);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the "public" directory
/* app.use(express.static(path.resolve(__dirname, './client/dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
}); */
app.use('/',(req,res)=>{
  res.send('Ecommerce-api')
})

// 404 error handling
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
