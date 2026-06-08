import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { DashboardStats } from '@/features/dashboard/types';

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export const analyticsService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats', {
      withCredentials: true,
    });
    return response.data.data;
  },

  async getSalesAnalytics(days = 30): Promise<SalesDataPoint[]> {
    const end = new Date();
    const start = new Date(Date.now() - days * 86400000);
    const response = await api.get<ApiResponse<SalesDataPoint[]>>('/dashboard/sales-analytics', {
      withCredentials: true,
      params: {
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      },
    });
    return response.data.data ?? [];
  },

  async getTopProducts() {
    const response = await api.get<ApiResponse<DashboardStats['topProducts']>>('/dashboard/top-products', {
      withCredentials: true,
    });
    return response.data.data ?? [];
  },
};
