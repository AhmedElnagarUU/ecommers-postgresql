import { NotificationModel } from './notification.model';
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
    const notification = {
      ...dto,
      status: 'unread',
    };
    return await NotificationModel.create(notification);
  }

  async getNotificationById(id: string): Promise<any> {
    return await NotificationModel.findById(id);
  }

  async getNotificationsByUserId(userId: string): Promise<any[]> {
    return await NotificationModel.find({ userId });
  }

  async getNotificationsByType(type: string): Promise<any[]> {
    return await NotificationModel.find({ type });
  }

  async getNotificationsByStatus(status: string): Promise<any[]> {
    return await NotificationModel.find({ status });
  }

  async updateNotification(id: string, dto: any): Promise<any> {
    const existingNotification = await NotificationModel.findById(id);
    if (!existingNotification) {
      return null;
    }

    const updateData = {
      ...dto,
    };

    return await NotificationModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  }

  async updateNotificationStatus(id: string, status: string): Promise<any> {
    return await NotificationModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async markAsRead(id: string): Promise<any> {
    return await NotificationModel.findByIdAndUpdate(id, { status: 'read', readAt: new Date() }, { new: true });
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const result = await NotificationModel.updateMany(
      { userId, status: 'unread' },
      { status: 'read', readAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await NotificationModel.findByIdAndDelete(id);
    return !!result;
  }

  async deleteAllNotificationsByUserId(userId: string): Promise<boolean> {
    const result = await NotificationModel.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  async createOrderStatusNotification(userId: string, orderId: string, status: string): Promise<any> {
    const dto = {
      userId,
      type: 'order_status',
      title: 'Order Status Update',
      message: `Your order #${orderId} has been ${status}`,
      priority: 'medium',
      data: { orderId, status },
    };
    return this.createNotification(dto);
  }

  async createPaymentStatusNotification(userId: string, orderId: string, status: string): Promise<any> {
    const dto = {
      userId,
      type: 'payment_status',
      title: 'Payment Status Update',
      message: `Payment for order #${orderId} has been ${status}`,
      priority: 'high',
      data: { orderId, status },
    };
    return this.createNotification(dto);
  }

  async createShippingUpdateNotification(userId: string, orderId: string, trackingNumber: string): Promise<any> {
    const dto = {
      userId,
      type: 'shipping_update',
      title: 'Shipping Update',
      message: `Your order #${orderId} has been shipped. Tracking number: ${trackingNumber}`,
      priority: 'medium',
      data: { orderId, trackingNumber },
    };
    return this.createNotification(dto);
  }
}
