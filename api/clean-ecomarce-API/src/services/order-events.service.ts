import { prisma } from '../config/database';
import { emailService } from '../modules/email/email.service';
import { AdminNotificationService } from '../modules/notification/admin-notification.service';
import { NotificationService } from '../modules/notification/notification.service';
import { eventBus } from '../eventBus/eventbus';
import logger from '../config/logger';

const adminNotifications = new AdminNotificationService();
const customerNotifications = new NotificationService(eventBus);

type OrderWithCustomer = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerId: string;
  customer?: { id: string; name: string; email: string } | null;
};

export async function onOrderPlaced(order: OrderWithCustomer): Promise<void> {
  try {
    const customer = order.customer ?? await prisma.customer.findUnique({
      where: { id: order.customerId },
      select: { id: true, name: true, email: true },
    });

    await adminNotifications.notifyOrderPlaced({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: customer?.name ?? 'Guest',
      customerEmail: customer?.email,
      totalAmount: order.totalAmount,
    });

    if (customer) {
      await customerNotifications.createNotification({
        customerId: customer.id,
        type: 'ORDER_STATUS',
        title: 'Order Confirmed',
        message: `Your order ${order.orderNumber} has been placed successfully.`,
        priority: 'MEDIUM',
        data: { orderId: order.id, orderNumber: order.orderNumber, status: order.status },
      });

      if (customer.email) {
        await emailService.sendOrderConfirmationEmail({
          to: customer.email,
          customerName: customer.name,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
        });
      }
    }

    await emailService.sendOrderNotification({
      orderNumber: order.orderNumber,
      customerName: customer?.name ?? 'Guest',
      customerEmail: customer?.email,
      total: order.totalAmount,
    });
  } catch (error) {
    logger.error('Failed to process order placed side effects', error);
  }
}

export async function onOrderStatusChanged(
  order: OrderWithCustomer,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  try {
    await adminNotifications.notifyOrderStatusChanged({
      orderId: order.id,
      orderNumber: order.orderNumber,
      oldStatus,
      newStatus,
      customerName: order.customer?.name,
      customerEmail: order.customer?.email,
    });

    if (order.customer) {
      await customerNotifications.createOrderStatusNotification(
        order.customer.id,
        order.orderNumber,
        newStatus.toLowerCase()
      );

      if (order.customer.email) {
        await emailService.sendOrderStatusEmail({
          to: order.customer.email,
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
          status: newStatus,
        });
      }
    }
  } catch (error) {
    logger.error('Failed to process order status change side effects', error);
  }
}

export async function onShipmentUpdated(
  order: OrderWithCustomer,
  trackingNumber: string
): Promise<void> {
  try {
    await adminNotifications.notifyShippingUpdate({
      orderId: order.id,
      orderNumber: order.orderNumber,
      trackingNumber,
      customerName: order.customer?.name,
    });

    if (order.customer) {
      await customerNotifications.createShippingUpdateNotification(
        order.customer.id,
        order.orderNumber,
        trackingNumber
      );

      if (order.customer.email) {
        await emailService.sendEmail({
          to: order.customer.email,
          subject: `Your order ${order.orderNumber} has shipped`,
          text: `Hi ${order.customer.name},\n\nYour order ${order.orderNumber} has shipped.\nTracking: ${trackingNumber}`,
          html: `<p>Hi ${order.customer.name},</p><p>Your order <strong>${order.orderNumber}</strong> has shipped.</p><p>Tracking: <strong>${trackingNumber}</strong></p>`,
        });
      }
    }
  } catch (error) {
    logger.error('Failed to process shipment side effects', error);
  }
}

export async function onPaymentStatusChanged(
  order: OrderWithCustomer,
  newStatus: string
): Promise<void> {
  try {
    if (order.customer) {
      await customerNotifications.createPaymentStatusNotification(
        order.customer.id,
        order.orderNumber,
        newStatus.toLowerCase()
      );
    }
  } catch (error) {
    logger.error('Failed to process payment status change side effects', error);
  }
}
