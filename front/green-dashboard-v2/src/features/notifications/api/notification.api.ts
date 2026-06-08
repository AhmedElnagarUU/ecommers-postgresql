import { api } from '@/shared/lib/axios';
import type { Notification } from '../types';

export type { Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<{ data: Notification[] }>('/notifications', {
      withCredentials: true,
    });
    return data.data ?? [];
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const { data } = await api.put<{ data: Notification }>(
      `/notifications/${notificationId}/read`,
      {},
      { withCredentials: true }
    );
    return data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all', {}, { withCredentials: true });
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ data: { count: number } }>(
      '/notifications/unread/count',
      { withCredentials: true }
    );
    return data.data?.count ?? 0;
  },
}; 