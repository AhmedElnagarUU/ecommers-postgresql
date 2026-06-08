import dotenv from 'dotenv';
import logger from '../../config/logger';

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || process.env.SMTP_HOST,
  port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true' || process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS,
  },
  defaultFrom: process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
  adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER,
};

export const validateEmailConfig = (): boolean => {
  if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
    logger.warn('Email credentials not configured. Email notifications are disabled.');
    return false;
  }
  return true;
};
