import { api, ApiEnvelope } from './api';
import type { Cart, CartItem, Category, Customer, Order, Product } from './types';

export const storeApi = {
  async getCategories() {
    const { data } = await api.get<ApiEnvelope<Category[]>>('/categories');
    return data.data;
  },

  async getProducts(params?: Record<string, string>) {
    const { data } = await api.get<ApiEnvelope<Product[]>>('/products', { params });
    return data.data;
  },

  async getProduct(id: string) {
    const { data } = await api.get<ApiEnvelope<Product>>(`/products/${id}`);
    return data.data;
  },

  async register(body: { name: string; email: string; password: string; phone?: string }) {
    const { data } = await api.post<ApiEnvelope<{ token: string; customer: Customer }>>('/auth/register', body);
    return data.data;
  },

  async login(body: { email: string; password: string }) {
    const { data } = await api.post<ApiEnvelope<{ token: string; customer: Customer }>>('/auth/login', body);
    return data.data;
  },

  async getCart() {
    const { data } = await api.get<ApiEnvelope<Cart>>('/cart');
    return data.data;
  },

  async updateCart(items: Array<{ productId: string; quantity: number; selectedVariants?: Record<string, string> }>) {
    const { data } = await api.put<ApiEnvelope<Cart>>('/cart', { items });
    return data.data;
  },

  async createOrder(body: Record<string, unknown>) {
    const { data } = await api.post<ApiEnvelope<Order>>('/orders', body);
    return data.data;
  },

  async getMyOrders() {
    const { data } = await api.get<ApiEnvelope<Order[]>>('/orders');
    return data.data;
  },

  async trackOrder(email: string, orderNumber: string) {
    const { data } = await api.get<ApiEnvelope<Order>>('/orders/track', {
      params: { email, orderNumber },
    });
    return data.data;
  },

  async getPixels() {
    const { data } = await api.get<ApiEnvelope<PublicPixel[]>>('/pixels');
    return data.data;
  },
};

export type { CartItem };
