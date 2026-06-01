import { api } from '@/lib/axios';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

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