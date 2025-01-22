import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Product from './models/Product.js';

try {
  await mongoose.connect(process.env.MONGO_URL);
  
  const jsonProducts = JSON.parse(
    await readFile(new URL('./utils/data.json', import.meta.url))
  );
  const products = jsonProducts.map((product) => {
    return { ...product };
  });
  
  await Product.create(products);
  console.log('Success!!!');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}