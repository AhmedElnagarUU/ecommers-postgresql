import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface VariantGroup {
  name: string;
  options: string[];
}

export interface VariantCombination {
  selections: Record<string, string>;
  stock?: number;
  price?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  imageUrls: any;
  status: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: VariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: VariantCombination[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: File[];
  status?: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: VariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: VariantCombination[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  _id: string;
}

class ProductService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>('/products', {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid products response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`, {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid product response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: CreateProductDTO): Promise<Product> {
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value === undefined) return;

        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
          return;
        }

        if (
          key === 'variantGroups' ||
          key === 'variantCombinations'
        ) {
          formData.append(key, JSON.stringify(value));
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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data?.data) {
        throw new Error('Invalid create product response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: UpdateProductDTO): Promise<Product> {
    try {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value === undefined || key === '_id') return;

        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
          return;
        }

        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
          return;
        }

        if (key === 'variantGroups' || key === 'variantCombinations') {
          formData.append(key, JSON.stringify(value));
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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response.data?.data) {
        throw new Error('Invalid update product response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<Product> {
    try {
      const response = await api.patch<ApiResponse<Product>>(`/products/${id}/status`, { status }, {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid update status response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>('/products/categories', {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid categories response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const productService = new ProductService(); 