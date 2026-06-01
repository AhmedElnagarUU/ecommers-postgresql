import { api } from '@/lib/axios';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isActive: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const productsService = {
  async getProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const { data } = await api.get<ProductsResponse>('/products', { params });
    return data;
  },

  async createProduct(formData: FormData) {
    const { data } = await api.post<{ success: boolean; data: Product }>('/products/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async updateProduct(id: string, formData: FormData) {
    const { data } = await api.patch<{ success: boolean; data: Product }>(
      `/products/admin/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
}; 