import mongoose from 'mongoose';

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
  const mongoDbUri =
    'mongodb+srv://xenbrelon:46620587nN@test.9nwa2.mongodb.net/?retryWrites=true&w=majority&appName=test';
  await mongoose.connect(mongoDbUri, {});
}
