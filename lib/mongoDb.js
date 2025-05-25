import mongoose from 'mongoose';
require('dotenv').config();

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
  const mongoDbUri = process.env.MONGO_DB_URL;
  await mongoose.connect(mongoDbUri, {});
}