import { PaymentModel } from './payment.model';
import logger from '../../config/logger';

export class PaymentService {
  constructor(private readonly paymentGateway: any) {
    logger.info('Payment service init');
  }

  async createPayment(dto: any): Promise<any> {
    const payment = {
      ...dto,
      status: 'pending',
    };
    return await PaymentModel.create(payment);
  }

  async getPaymentById(id: string): Promise<any> {
    return await PaymentModel.findById(id);
  }

  async getPaymentByOrderId(orderId: string): Promise<any> {
    return await PaymentModel.findOne({ orderId });
  }

  async getPaymentsByUserId(userId: string): Promise<any[]> {
    return await PaymentModel.find({ userId });
  }

  async updatePayment(id: string, dto: any): Promise<any> {
    const existingPayment = await PaymentModel.findById(id);
    if (!existingPayment) {
      return null;
    }

    const updateData = {
      ...dto,
    };

    return await PaymentModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  }

  async updatePaymentStatus(id: string, status: string): Promise<any> {
    return await PaymentModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await PaymentModel.findByIdAndDelete(id);
    return !!result;
  }

  async processPayment(paymentId: string): Promise<any> {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      return null;
    }

    try {
      const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentId, { status: 'completed' }, { new: true });
      return updatedPayment;
    } catch (error) {
      await PaymentModel.findByIdAndUpdate(paymentId, { status: 'failed' });
      throw error;
    }
  }

  async refundPayment(paymentId: string): Promise<any> {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      return null;
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    try {
      const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentId, { status: 'refunded' }, { new: true });
      return updatedPayment;
    } catch (error) {
      throw error;
    }
  }

  async createPaymentIntent(product: any): Promise<any> {
    logger.info('Creating payment intent with Stripe');
    const result = await this.paymentGateway.createCheckoutSession(product);
    logger.info('Payment intent created successfully');
    return result;
  }
}
