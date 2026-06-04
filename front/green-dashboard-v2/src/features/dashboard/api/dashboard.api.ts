import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { DashboardStats, RecentOrder } from '../types';

export type { DashboardStats, RecentOrder, DashboardPageStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats', {
      withCredentials: true,
    });

    if (!response.data?.data) {
      throw new Error('Invalid dashboard data response');
    }

    return response.data.data;
  },

  async getRecentOrders(): Promise<RecentOrder[]> {
    const response = await api.get<ApiResponse<RecentOrder[]>>('/dashboard/recent-orders', {
      withCredentials: true,
    });
    if (!response.data?.data) {
      throw new Error('Invalid recent orders response');
    }
    return response.data.data;
  },
};
