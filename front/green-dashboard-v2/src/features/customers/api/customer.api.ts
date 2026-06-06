import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';

export interface DashboardCustomer {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
}

export const customersService = {
  async getCustomers(): Promise<DashboardCustomer[]> {
    const response = await api.get<ApiResponse<DashboardCustomer[]>>('/customers', {
      withCredentials: true,
    });

    return (response.data?.data ?? []).map((customer) => ({
      ...customer,
      _id: customer._id || customer.id || '',
      phone: customer.phone || 'Not provided',
      location: customer.location || 'Not provided',
      totalOrders: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
    }));
  },
};
