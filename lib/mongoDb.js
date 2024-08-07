import mongoose from 'mongoose';
import config from './config/config';

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
  const mongoDbUri = config.mongoDb;
  await mongoose.connect(mongoDbUri, {});
}
