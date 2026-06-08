import { prisma } from '../../config/database';
import { AdminNotificationType } from '../../generated/prisma/client';

function toDashboardType(type: AdminNotificationType): string {
  switch (type) {
    case 'ORDER_PLACED':
      return 'order_placed';
    case 'ORDER_STATUS_CHANGED':
      return 'order_status_changed';
    case 'SHIPPING_STATUS_CHANGED':
      return 'shipping_status_changed';
    default:
      return 'order_placed';
  }
}

export function formatAdminNotification(notification: {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  status: string;
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    _id: notification.id,
    type: toDashboardType(notification.type),
    title: notification.title,
    message: notification.message,
    data: (notification.data as Record<string, unknown>) ?? {},
    read: notification.status === 'READ',
    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt.toISOString(),
  };
}

export class AdminNotificationService {
  async list(limit = 50) {
    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return notifications.map(formatAdminNotification);
  }

  async getUnreadCount(): Promise<number> {
    return prisma.adminNotification.count({ where: { status: 'UNREAD' } });
  }

  async markAsRead(id: string) {
    const notification = await prisma.adminNotification.update({
      where: { id },
      data: { status: 'READ', readAt: new Date() },
    });
    return formatAdminNotification(notification);
  }

  async markAllAsRead(): Promise<number> {
    const result = await prisma.adminNotification.updateMany({
      where: { status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    });
    return result.count;
  }

  async notifyOrderPlaced(data: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    customerEmail?: string;
    totalAmount: number;
  }) {
    return prisma.adminNotification.create({
      data: {
        type: 'ORDER_PLACED',
        title: 'New Order',
        message: `Order ${data.orderNumber} placed by ${data.customerName} for $${data.totalAmount.toFixed(2)}`,
        data: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
        },
      },
    });
  }

  async notifyOrderStatusChanged(data: {
    orderId: string;
    orderNumber: string;
    oldStatus: string;
    newStatus: string;
    customerName?: string;
    customerEmail?: string;
  }) {
    return prisma.adminNotification.create({
      data: {
        type: 'ORDER_STATUS_CHANGED',
        title: 'Order Status Updated',
        message: `Order ${data.orderNumber} changed from ${data.oldStatus} to ${data.newStatus}`,
        data: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          oldStatus: data.oldStatus,
          newStatus: data.newStatus,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
        },
      },
    });
  }

  async notifyShippingUpdate(data: {
    orderId: string;
    orderNumber: string;
    trackingNumber: string;
    customerName?: string;
  }) {
    return prisma.adminNotification.create({
      data: {
        type: 'SHIPPING_STATUS_CHANGED',
        title: 'Shipment Updated',
        message: `Order ${data.orderNumber} shipped. Tracking: ${data.trackingNumber}`,
        data: {
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          trackingNumber: data.trackingNumber,
          customerName: data.customerName,
        },
      },
    });
  }
}
