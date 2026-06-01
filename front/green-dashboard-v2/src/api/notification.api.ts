import { api } from '@/lib/axios';

export interface Notification {
  _id: string;
  type: 'order_placed' | 'order_status_changed' | 'shipping_status_changed';
  title: string;
  message: string;
  data: {
    orderId?: string;
    orderNumber?: string;
    oldStatus?: string;
    newStatus?: string;
    customerName?: string;
    customerEmail?: string;
  };
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<{ success: boolean; data: Notification[] }>('/notifications');
    return data.data;
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const { data } = await api.put<{ success: boolean; data: Notification }>(
      `/notifications/${notificationId}/read`
    );
    return data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ success: boolean; data: { count: number } }>(
      '/notifications/unread/count'
    );
    return data.data.count;
  }
}; 