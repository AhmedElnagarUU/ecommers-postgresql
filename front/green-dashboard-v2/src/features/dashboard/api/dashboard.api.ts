import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { DashboardStats, RecentOrder } from '../types';

export type { DashboardStats, RecentOrder, DashboardPageStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats', {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid dashboard data response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  async getRecentOrders(): Promise<RecentOrder[]> {
    const { data } = await api.get('/dashboard/orders/recent');
    return data.data;
  },
}; 