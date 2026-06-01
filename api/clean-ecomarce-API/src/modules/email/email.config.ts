import dotenv from 'dotenv';
import logger from '../../config/logger';

// Make sure environment variables are loaded
dotenv.config();

// Email configuration
export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT as string),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  defaultFrom: process.env.EMAIL_FROM,
  adminEmail: process.env.ADMIN_EMAIL,
};

// Validate email configuration
export const validateEmailConfig = (): boolean => {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    logger.warn('Email credentials not configured properly. Email notifications will not work.');
    return false;
  }
  return true;
}; 