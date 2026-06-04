import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';
import {
  categoryToApiPayload,
  normalizeCategories,
  normalizeCategory,
} from '../lib/normalize-category';

export type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories', {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid categories response');
    return normalizeCategories(response.data.data as unknown as Record<string, unknown>[]);
  }

  async getCategory(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`, {
      withCredentials: true,
    });
    if (!response.data?.data) throw new Error('Invalid category response');
    return normalizeCategory(response.data.data as unknown as Record<string, unknown>);
  }

  async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>(
      '/categories',
      categoryToApiPayload(categoryData),
      { withCredentials: true }
    );
    if (!response.data?.data) throw new Error('Invalid create category response');
    return normalizeCategory(response.data.data as unknown as Record<string, unknown>);
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDTO): Promise<Category> {
    const { _id: _omit, ...rest } = categoryData;
    const response = await api.put<ApiResponse<Category>>(
      `/categories/${id}`,
      categoryToApiPayload(rest),
      { withCredentials: true }
    );
    if (!response.data?.data) throw new Error('Invalid update category response');
    return normalizeCategory(response.data.data as unknown as Record<string, unknown>);
  }

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`, { withCredentials: true });
  }

  async updateCategoryStatus(id: string, status: 'active' | 'inactive'): Promise<Category> {
    const response = await api.patch<ApiResponse<Category>>(
      `/categories/${id}/status`,
      { isActive: status === 'active' },
      { withCredentials: true }
    );
    if (!response.data?.data) throw new Error('Invalid update status response');
    return normalizeCategory(response.data.data as unknown as Record<string, unknown>);
  }
}

export const categoryService = new CategoryService();
