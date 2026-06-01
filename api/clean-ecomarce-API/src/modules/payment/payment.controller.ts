import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import logger from '../../config/logger';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      const payment = await this.paymentService.createPayment(dto);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const payment = await this.paymentService.getPaymentByOrderId(orderId);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPaymentsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const payments = await this.paymentService.getPaymentsByUserId(userId);
      res.json(payments);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body;
      const payment = await this.paymentService.updatePayment(id, dto);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async processPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.processPayment(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refundPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.refundPayment(id);
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.paymentService.deletePayment(id);
      if (!success) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      logger.info('payment usecase controller createPaymentIntent');
      const { product } = req.body;
      logger.info(` usecase : Amount: ${product}`);
      const paymentIntent = await this.paymentService.createPaymentIntent(product);
      logger.info('Payment intent created successfully in controller');
      logger.info(`Payment Intent: ${paymentIntent}`);
      res.status(201).json(paymentIntent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
