import slugify from 'slugify';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';

export class CategoryService {
  constructor() {}

  async getAllCategories(): Promise<any[]> {
    try {
      return await prisma.category.findMany({ include: { children: true } });
    } catch (error) {
      throw new ApiError(500, 'Error fetching categories');
    }
  }

  async getCategoryById(id: string): Promise<any> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: { children: true, parent: true },
      });
      if (!category) throw new ApiError(404, 'Category not found');
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching category');
    }
  }

  async createCategory(dto: any): Promise<any> {
    try {
      const slug = slugify(dto.name, { lower: true });
      return await prisma.category.create({
        data: {
          name: dto.name,
          description: dto.description,
          slug,
          isActive: dto.isActive ?? true,
          parentId: dto.parentId ?? null,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating category');
    }
  }

  async updateCategory(id: string, dto: any): Promise<any> {
    try {
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Category not found');

      const data: any = { ...dto };
      if (dto.name) data.slug = slugify(dto.name, { lower: true });

      return await prisma.category.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category');
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Category not found');
      await prisma.category.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting category');
    }
  }

  async updateCategoryStatus(id: string, isActive: boolean): Promise<any> {
    try {
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) throw new ApiError(404, 'Category not found');
      return await prisma.category.update({ where: { id }, data: { isActive } });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category status');
    }
  }

  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { name: true },
      });
      return categories.map((c) => c.name);
    } catch (error) {
      throw new ApiError(500, 'Error fetching category names');
    }
  }
}
