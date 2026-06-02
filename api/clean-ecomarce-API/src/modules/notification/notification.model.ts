export type NotificationType = 'ORDER_STATUS' | 'PAYMENT_STATUS' | 'SHIPPING_UPDATE' | 'GENERAL';
export type NotificationStatus = 'UNREAD' | 'READ';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface INotification {
  id: string;
  customerId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: Record<string, unknown> | null;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
