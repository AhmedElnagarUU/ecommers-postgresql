import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { CreateProductDTO, Product, UpdateProductDTO } from '../types';
import { normalizeProduct, normalizeProducts, productStatusToApi } from '../lib/normalize-product';

class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid products response');
    return normalizeProducts(response.data.data as unknown as Record<string, unknown>[]);
  }

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid product response');
    return normalizeProduct(response.data.data as unknown as Record<string, unknown>);
  }

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value === undefined) return;
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('images', file);
        });
        return;
      }
      if (key === 'variantGroups' || key === 'variantCombinations') {
        formData.append(key, JSON.stringify(value));
        return;
      }
      if (key === 'status' && typeof value === 'string') {
        formData.append(key, productStatusToApi(value as 'active' | 'inactive'));
        return;
      }
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
        return;
      }
      formData.append(key, value.toString());
    });

    const response = await api.post<ApiResponse<Product>>('/products', formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!response.data?.data) throw new Error('Invalid create product response');
    return normalizeProduct(response.data.data as unknown as Record<string, unknown>);
  }

  async updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value === undefined || key === '_id') return;
      if (key === 'images' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('images', file);
        });
        return;
      }
      if (key === 'variantGroups' || key === 'variantCombinations') {
        formData.append(key, JSON.stringify(value));
        return;
      }
      if (key === 'status' && typeof value === 'string') {
        formData.append(key, productStatusToApi(value as 'active' | 'inactive'));
        return;
      }
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
        return;
      }
      formData.append(key, value.toString());
    });

    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!response.data?.data) throw new Error('Invalid update product response');
    return normalizeProduct(response.data.data as unknown as Record<string, unknown>);
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`, { withCredentials: true });
  }

  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(
      `/products/${id}`,
      { status: productStatusToApi(status) },
      { withCredentials: true }
    );
    if (!response.data?.data) throw new Error('Invalid update status response');
    return normalizeProduct(response.data.data as unknown as Record<string, unknown>);
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/products/categories', {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid categories response');
    return response.data.data;
  }
}

export const productService = new ProductService();
