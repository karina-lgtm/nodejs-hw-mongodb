import mongoose from 'mongoose';
import process from 'process';

export const initMongoConnection = async () => {
  try {
    const { MONGODB_URI } = process.env;

    await mongoose.connect(MONGODB_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
};