import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  logger.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter } as any);

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully via Prisma');
  } catch (error) {
    logger.error('❌ Prisma connection error:', error);
    process.exit(1);
  }
};
