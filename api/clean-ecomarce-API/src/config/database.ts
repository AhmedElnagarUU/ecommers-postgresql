import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  logger.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
}); 