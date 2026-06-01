import { Request, Response } from 'express';
import { emailService } from './email.service';

export class EmailController {
  async createEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, subject, text, html } = req.body;
      const result = await emailService.sendEmail({ to, subject, text, html });
      res.status(201).json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Error creating email', error });
    }
  }

  async createOrderConfirmationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, orderId, orderDetails } = req.body;
      const subject = `Order Confirmation - #${orderId}`;
      const text = `Your order #${orderId} has been confirmed.`;
      const html = `<h1>Order Confirmation</h1><p>Your order #${orderId} has been confirmed.</p>`;
      const result = await emailService.sendEmail({ to, subject, text, html });
      res.status(201).json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order confirmation email', error });
    }
  }

  async createShippingUpdateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, orderId, trackingNumber } = req.body;
      const subject = `Shipping Update - Order #${orderId}`;
      const text = `Your order #${orderId} has been shipped. Tracking number: ${trackingNumber}`;
      const html = `<h1>Shipping Update</h1><p>Your order #${orderId} has been shipped.</p><p>Tracking number: ${trackingNumber}</p>`;
      const result = await emailService.sendEmail({ to, subject, text, html });
      res.status(201).json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Error creating shipping update email', error });
    }
  }

  async createPasswordResetEmail(req: Request, res: Response): Promise<void> {
    try {
      const { to, resetToken } = req.body;
      const subject = 'Password Reset';
      const text = `Click the link to reset your password: ${resetToken}`;
      const html = `<h1>Password Reset</h1><p>Click the link to reset your password: <a href="${resetToken}">Reset Password</a></p>`;
      const result = await emailService.sendEmail({ to, subject, text, html });
      res.status(201).json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Error creating password reset email', error });
    }
  }
}
