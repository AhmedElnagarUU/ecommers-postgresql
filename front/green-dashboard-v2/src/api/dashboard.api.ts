import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

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