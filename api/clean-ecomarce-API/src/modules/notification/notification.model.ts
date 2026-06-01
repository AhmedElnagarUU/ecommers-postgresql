import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotificationType = 'order_status' | 'payment_status' | 'shipping_update' | 'general';
export type NotificationStatus = 'unread' | 'read';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface INotification {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument extends INotification, Document {}

const notificationSchema = new Schema<NotificationDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true, default: 'unread' },
  data: { type: Schema.Types.Mixed },
  readAt: { type: Date },
}, {
  timestamps: true
});

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', notificationSchema);
