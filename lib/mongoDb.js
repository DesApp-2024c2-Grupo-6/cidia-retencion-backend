import mongoose from 'mongoose';

// ver dónde se usa connectToMongoDb
// hay que ejecutarla cuando se levanta la app
export async function connectToMongoDb() {
  const mongoDbUri =
    'mongodb+srv://kevinaxelcasas:TWJSUejVQltoSV02@cluster0.zmkeo.mongodb.net/';
  await mongoose.connect(mongoDbUri, {});
}
