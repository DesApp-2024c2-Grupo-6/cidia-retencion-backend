import mongoose from 'mongoose';

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
  const mongoDbUri =
    'mongodb+srv://isrunaway:AlCcz4c2GJVNTcef@cluster0.yxhvxbd.mongodb.net/';
  await mongoose.connect(mongoDbUri, {});
}
