import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  _id: string;
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/categories', {
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

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(`/categories/${id}`, {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid category response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
    try {
      const response = await api.post<ApiResponse<Category>>('/categories', categoryData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data?.data) {
        throw new Error('Invalid create category response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    try {
      const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data?.data) {
        throw new Error('Invalid update category response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/categories/${id}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  async updateCategoryStatus(id: string, status: 'active' | 'inactive'): Promise<Category> {
    try {
      const response = await api.patch<ApiResponse<Category>>(`/categories/${id}/status`, { status }, {
        withCredentials: true
      });

      if (!response.data?.data) {
        throw new Error('Invalid update status response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating category status:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService(); 