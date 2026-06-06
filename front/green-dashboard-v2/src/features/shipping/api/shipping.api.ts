import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import {
  CreateShipmentDTO,
  CreateShippingMethodDTO,
  CreateShippingZoneDTO,
  Shipment,
  ShippingMethod,
  ShippingOrderOption,
  ShippingZone,
  UpdateShipmentDTO,
  UpdateShippingMethodDTO,
  UpdateShippingZoneDTO,
  WorldLocationCountry,
} from '../types';

type OrdersListResponse = {
  success: boolean;
  data: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    customer?: {
      name?: string;
    };
  }>;
};

export const shippingService = {
  async getWorldLocations(): Promise<WorldLocationCountry[]> {
    const response = await api.get<ApiResponse<WorldLocationCountry[]>>('/shipping/world/locations', {
      withCredentials: true,
    });
    return response.data?.data ?? [];
  },

  async getWorldCountries(search?: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/shipping/world/countries', {
      withCredentials: true,
      params: { search, limit: 300 },
    });
    return response.data?.data ?? [];
  },

  async getWorldCities(country: string, search?: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/shipping/world/cities', {
      withCredentials: true,
      params: { country, search, limit: 1000 },
    });
    return response.data?.data ?? [];
  },

  async getZones(): Promise<ShippingZone[]> {
    const response = await api.get<ApiResponse<ShippingZone[]>>('/shipping/zones', {
      withCredentials: true,
    });
    return response.data?.data ?? [];
  },

  async createZone(payload: CreateShippingZoneDTO): Promise<ShippingZone> {
    const response = await api.post<ApiResponse<ShippingZone>>('/shipping/zones', payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid create shipping zone response');
    return response.data.data;
  },

  async updateZone(id: string, payload: UpdateShippingZoneDTO): Promise<ShippingZone> {
    const response = await api.put<ApiResponse<ShippingZone>>(`/shipping/zones/${id}`, payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid update shipping zone response');
    return response.data.data;
  },

  async deleteZone(id: string): Promise<void> {
    await api.delete(`/shipping/zones/${id}`, {
      withCredentials: true,
    });
  },

  async quoteZone(country: string, city: string) {
    const response = await api.get<
      ApiResponse<{
        zone: ShippingZone;
        price: number;
        location: { country: string; city: string };
      }>
    >('/shipping/zones/quote', {
      withCredentials: true,
      params: { country, city },
    });
    if (!response.data?.data) throw new Error('Invalid shipping quote response');
    return response.data.data;
  },

  async getMethods(): Promise<ShippingMethod[]> {
    const response = await api.get<ApiResponse<ShippingMethod[]>>('/shipping/methods', {
      withCredentials: true,
    });
    return response.data?.data ?? [];
  },

  async createMethod(payload: CreateShippingMethodDTO): Promise<ShippingMethod> {
    const response = await api.post<ApiResponse<ShippingMethod>>('/shipping/methods', payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid create shipping method response');
    return response.data.data;
  },

  async updateMethod(id: string, payload: UpdateShippingMethodDTO): Promise<ShippingMethod> {
    const response = await api.put<ApiResponse<ShippingMethod>>(`/shipping/methods/${id}`, payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid update shipping method response');
    return response.data.data;
  },

  async deleteMethod(id: string): Promise<void> {
    await api.delete(`/shipping/methods/${id}`, {
      withCredentials: true,
    });
  },

  async getShipments(): Promise<Shipment[]> {
    const response = await api.get<ApiResponse<Shipment[]>>('/shipping/shipments', {
      withCredentials: true,
    });
    return response.data?.data ?? [];
  },

  async createShipment(payload: CreateShipmentDTO): Promise<Shipment> {
    const response = await api.post<ApiResponse<Shipment>>('/shipping/shipments', payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid create shipment response');
    return response.data.data;
  },

  async updateShipment(id: string, payload: UpdateShipmentDTO): Promise<Shipment> {
    const response = await api.put<ApiResponse<Shipment>>(`/shipping/shipments/${id}`, payload, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid update shipment response');
    return response.data.data;
  },

  async deleteShipment(id: string): Promise<void> {
    await api.delete(`/shipping/shipments/${id}`, {
      withCredentials: true,
    });
  },

  async getOrdersForShipment(): Promise<ShippingOrderOption[]> {
    const response = await api.get<OrdersListResponse>('/orders', { withCredentials: true });
    const orders = response.data?.data ?? [];
    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name ?? 'Unknown',
      totalAmount: order.totalAmount ?? 0,
    }));
  },
};
