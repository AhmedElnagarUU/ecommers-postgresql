import { prisma } from '../../config/database';
import logger from '../../config/logger';
import { eventBus } from '../../eventBus/eventbus';

export class NotificationService {
  constructor(private readonly event: any) {
    logger.info('NotificationService initialized');
    event.on('customer.created', (customer: any) => {
      logger.info(`NotificationService received customer.created event for customer: ${customer.email}`);
    });
  }

  async createNotification(dto: any): Promise<any> {
    return await prisma.notification.create({
      data: {
        customerId: dto.customerId ?? dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        priority: dto.priority ?? 'MEDIUM',
        status: 'UNREAD',
        data: dto.data ?? null,
      },
    });
  }

  async getNotificationById(id: string): Promise<any> {
    return await prisma.notification.findUnique({ where: { id } });
  }

  async getNotificationsByUserId(userId: string): Promise<any[]> {
    return await prisma.notification.findMany({ where: { customerId: userId } });
  }

  async getNotificationsByType(type: string): Promise<any[]> {
    return await prisma.notification.findMany({ where: { type: type as any } });
  }

  async getNotificationsByStatus(status: string): Promise<any[]> {
    return await prisma.notification.findMany({ where: { status: status as any } });
  }

  async updateNotification(id: string, dto: any): Promise<any> {
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing) return null;
    return await prisma.notification.update({ where: { id }, data: dto });
  }

  async updateNotificationStatus(id: string, status: string): Promise<any> {
    return await prisma.notification.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async markAsRead(id: string): Promise<any> {
    return await prisma.notification.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await prisma.notification.updateMany({
      where: { customerId: userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });
    return result.count > 0;
  }

  async deleteNotification(id: string): Promise<boolean> {
    try {
      await prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async deleteAllNotificationsByUserId(userId: string): Promise<boolean> {
    const result = await prisma.notification.deleteMany({ where: { customerId: userId } });
    return result.count > 0;
  }

  async createOrderStatusNotification(userId: string, orderId: string, status: string): Promise<any> {
    return this.createNotification({
      customerId: userId,
      type: 'ORDER_STATUS',
      title: 'Order Status Update',
      message: `Your order #${orderId} has been ${status}`,
      priority: 'MEDIUM',
      data: { orderId, status },
    });
  }

  async createPaymentStatusNotification(userId: string, orderId: string, status: string): Promise<any> {
    return this.createNotification({
      customerId: userId,
      type: 'PAYMENT_STATUS',
      title: 'Payment Status Update',
      message: `Payment for order #${orderId} has been ${status}`,
      priority: 'HIGH',
      data: { orderId, status },
    });
  }

  async createShippingUpdateNotification(userId: string, orderId: string, trackingNumber: string): Promise<any> {
    return this.createNotification({
      customerId: userId,
      type: 'SHIPPING_UPDATE',
      title: 'Shipping Update',
      message: `Your order #${orderId} has been shipped. Tracking number: ${trackingNumber}`,
      priority: 'MEDIUM',
      data: { orderId, trackingNumber },
    });
  }
}
