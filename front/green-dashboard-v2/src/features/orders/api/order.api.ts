import { api } from '@/shared/lib/axios';
import type { Order, OrdersResponse, OrderStatus } from '../types';
import { normalizeOrder, normalizeOrders, toApiStatus } from '../lib/normalize-order';

export type { Order, OrderItem, OrderStatus, OrdersResponse } from '../types';

export const ordersService = {
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  }) {
    const { data } = await api.get<OrdersResponse>('/orders', { params });
    return normalizeOrders((data.data ?? []) as Record<string, unknown>[]);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const { data } = await api.patch<{ success: boolean; data: Record<string, unknown> }>(
      `/orders/${orderId}/status`,
      { status: toApiStatus(status) }
    );
    return normalizeOrder(data.data);
  },

  async deleteOrder(orderId: string) {
    await api.delete(`/orders/${orderId}`);
  },
};
