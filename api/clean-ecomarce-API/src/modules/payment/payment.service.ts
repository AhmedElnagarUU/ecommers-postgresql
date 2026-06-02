import { prisma } from '../../config/database';
import logger from '../../config/logger';

export class PaymentService {
  constructor(private readonly paymentGateway: any) {
    logger.info('Payment service init');
  }

  async createPayment(dto: any): Promise<any> {
    return await prisma.payment.create({
      data: {
        customerId: dto.customerId ?? dto.userId,
        orderId: dto.orderId,
        amount: dto.amount,
        currency: dto.currency,
        status: 'PENDING',
        method: dto.method,
        transactionId: dto.transactionId,
        errorMessage: dto.errorMessage,
      },
    });
  }

  async getPaymentById(id: string): Promise<any> {
    return await prisma.payment.findUnique({ where: { id } });
  }

  async getPaymentByOrderId(orderId: string): Promise<any> {
    return await prisma.payment.findFirst({ where: { orderId } });
  }

  async getPaymentsByUserId(userId: string): Promise<any[]> {
    return await prisma.payment.findMany({ where: { customerId: userId } });
  }

  async updatePayment(id: string, dto: any): Promise<any> {
    const existing = await prisma.payment.findUnique({ where: { id } });
    if (!existing) return null;
    return await prisma.payment.update({ where: { id }, data: dto });
  }

  async updatePaymentStatus(id: string, status: string): Promise<any> {
    return await prisma.payment.update({ where: { id }, data: { status: status as any } });
  }

  async deletePayment(id: string): Promise<boolean> {
    try {
      await prisma.payment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async processPayment(paymentId: string): Promise<any> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return null;

    try {
      return await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'COMPLETED' },
      });
    } catch (error) {
      await prisma.payment.update({ where: { id: paymentId }, data: { status: 'FAILED' } });
      throw error;
    }
  }

  async refundPayment(paymentId: string): Promise<any> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return null;
    if (payment.status !== 'COMPLETED') {
      throw new Error('Only completed payments can be refunded');
    }

    return await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });
  }

  async createPaymentIntent(product: any): Promise<any> {
    logger.info('Creating payment intent with Stripe');
    const result = await this.paymentGateway.createCheckoutSession(product);
    logger.info('Payment intent created successfully');
    return result;
  }
}
