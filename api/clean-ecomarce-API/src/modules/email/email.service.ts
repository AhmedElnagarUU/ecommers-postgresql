import nodemailer from 'nodemailer';
import { emailConfig, validateEmailConfig } from './email.config';
import logger from '../../config/logger';

// Initialize nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
      user: emailConfig.auth.user,
      pass: emailConfig.auth.pass,
    },
  });
};

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null;
  private isConfigValid: boolean;

  constructor() {
    this.isConfigValid = validateEmailConfig();
    this.transporter = this.isConfigValid ? createTransporter() : null;
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    // If configuration is not valid, log a warning and don't attempt to send
    if (!this.isConfigValid || !this.transporter) {
      logger.warn(`Email not sent - Invalid email configuration: ${options.subject}`);
      return false;
    }

    try {
      const result = await this.transporter.sendMail({
        from: emailConfig.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      logger.info(`Email sent: ${result.messageId}`);
      return true;
    } catch (error) {
      logger.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send notification to admin
   */
  async sendAdminNotification(subject: string, message: string, html?: string): Promise<boolean> {
    return this.sendEmail({
      to: emailConfig.adminEmail as string,
      subject,
      text: message,
      html: html || message.replace(/\n/g, '<br>'),
    });
  }

  /**
   * Send order notification to admin
   */
  async sendOrderNotification(orderData: any): Promise<boolean> {
    const subject = `New Order Placed: #${orderData.orderNumber}`;
    
    // Create a simple text version of the email
    const text = `
A new order has been placed on your store.

Order Details:
- Order Number: ${orderData.orderNumber}
- Customer: ${orderData.customerName}
- Email: ${orderData.customerEmail || 'N/A'}
- Total Amount: $${orderData.total.toFixed(2)}
- Date: ${new Date().toLocaleString()}

Please login to the admin dashboard to view the complete order details.
`;

    // Create a more formatted HTML version
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">New Order Notification</h2>
        <p>A new order has been placed on your store.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Customer:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail || 'N/A'}</p>
          <p><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>Please <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/orders" style="color: #4CAF50;">login to the admin dashboard</a> to view the complete order details.</p>
        </div>
      </div>
    `;

    return this.sendAdminNotification(subject, text, html);
  }
}

// Create and export a singleton instance
export const emailService = new EmailService(); 