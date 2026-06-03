import { api } from '@/shared/lib/axios';
import type { Notification } from '../types';

export type { Notification } from '../types';

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