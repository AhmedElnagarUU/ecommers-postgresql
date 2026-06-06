import { api, ApiEnvelope } from './api';
import type { Cart, CartItem, Category, Customer, CustomerAddress, Order, Product } from './types';
import type { PublicPixel } from './pixel-types';
import {
  normalizeCart,
  normalizeCategories,
  normalizeOrder,
  normalizeOrders,
  normalizeProduct,
  normalizeProducts,
} from './normalize-store';

export const storeApi = {
  async getCategories() {
    const { data } = await api.get<ApiEnvelope<Category[]>>('/categories');
    return normalizeCategories((data.data ?? []) as unknown as Record<string, unknown>[]);
  },

  async getProducts(params?: Record<string, string>) {
    const { data } = await api.get<ApiEnvelope<Product[]>>('/products', { params });
    return normalizeProducts((data.data ?? []) as unknown as Record<string, unknown>[]);
  },

  async getProduct(id: string) {
    const { data } = await api.get<ApiEnvelope<Product>>(`/products/${id}`);
    return normalizeProduct(data.data as unknown as Record<string, unknown>);
  },

  async register(body: { name: string; email: string; password: string; phone?: string }) {
    const { data } = await api.post<ApiEnvelope<{ token: string; customer: Customer }>>('/auth/register', body);
    return data.data;
  },

  async login(body: { email: string; password: string }) {
    const { data } = await api.post<ApiEnvelope<{ token: string; customer: Customer }>>('/auth/login', body);
    return data.data;
  },

  async getMe() {
    const { data } = await api.get<ApiEnvelope<Customer>>('/auth/me');
    return data.data;
  },

  async updateProfile(body: {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const { data } = await api.patch<ApiEnvelope<{ token: string; customer: Customer }>>('/auth/me', body);
    return data.data;
  },

  async getAddresses() {
    const { data } = await api.get<ApiEnvelope<CustomerAddress[]>>('/addresses');
    return data.data ?? [];
  },

  async createAddress(body: Omit<CustomerAddress, 'id' | 'isDefault'> & { isDefault?: boolean }) {
    const { data } = await api.post<ApiEnvelope<CustomerAddress>>('/addresses', body);
    return data.data;
  },

  async updateAddress(id: string, body: Partial<Omit<CustomerAddress, 'id'>>) {
    const { data } = await api.put<ApiEnvelope<CustomerAddress>>(`/addresses/${id}`, body);
    return data.data;
  },

  async deleteAddress(id: string) {
    await api.delete(`/addresses/${id}`);
  },

  async getCart() {
    const { data } = await api.get<ApiEnvelope<Cart>>('/cart');
    return normalizeCart(data.data as unknown as Record<string, unknown>);
  },

  async updateCart(items: Array<{ productId: string; quantity: number; selectedVariants?: Record<string, string> }>) {
    const { data } = await api.put<ApiEnvelope<Cart>>('/cart', { items });
    return normalizeCart(data.data as unknown as Record<string, unknown>);
  },

  async createOrder(body: Record<string, unknown>) {
    const { data } = await api.post<ApiEnvelope<Order>>('/orders', body);
    return normalizeOrder(data.data as unknown as Record<string, unknown>);
  },

  async getMyOrders() {
    const { data } = await api.get<ApiEnvelope<Order[]>>('/orders');
    return normalizeOrders((data.data ?? []) as unknown as Record<string, unknown>[]);
  },

  async trackOrder(email: string, orderNumber: string) {
    const { data } = await api.get<ApiEnvelope<Order>>('/orders/track', {
      params: { email, orderNumber },
    });
    return normalizeOrder(data.data as unknown as Record<string, unknown>);
  },

  async getPixels() {
    const { data } = await api.get<ApiEnvelope<PublicPixel[]>>('/pixels');
    return data.data;
  },
};

export type { CartItem };
