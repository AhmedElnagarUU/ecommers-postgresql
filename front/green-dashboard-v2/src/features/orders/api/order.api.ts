import { api } from '@/shared/lib/axios';
import type { Order, OrdersResponse } from '../types';

export type { Order, OrderItem, OrderStatus, OrdersResponse } from '../types';

export const ordersService = {
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string
  }) {
    console.log('try get orders')
    const { data } = await api.get<OrdersResponse>('/orders', { params });
    console.log(data);
    return data.data;

  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data } = await api.patch<{ success: boolean; data: Order }>(
      `/orders/${orderId}/status`,
      { status }
    );
    return data.data;
  },

  async deleteOrder(orderId: string) {
    await api.delete(`/orders/${orderId}`);
  },
}; 