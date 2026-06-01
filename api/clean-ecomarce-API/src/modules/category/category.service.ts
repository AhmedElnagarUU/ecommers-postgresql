import { CategoryModel } from './category.model';
import slugify from 'slugify';
import { ApiError } from '../../utils/ApiError';

export class CategoryService {
  constructor() {}

  async getAllCategories(): Promise<any[]> {
    try {
      return await CategoryModel.find();
    } catch (error) {
      throw new ApiError(500, 'Error fetching categories');
    }
  }

  async getCategoryById(id: string): Promise<any> {
    try {
      const category = await CategoryModel.findById(id);
      if (!category) {
        throw new ApiError(404, 'Category not found');
      }
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error fetching category');
    }
  }

  async createCategory(dto: any): Promise<any> {
    try {
      const slug = slugify(dto.name, { lower: true });
      const categoryData = {
        ...dto,
        slug,
        isActive: dto.isActive ?? true,
      };
      return await CategoryModel.create(categoryData);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error creating category');
    }
  }

  async updateCategory(id: string, dto: any): Promise<any> {
    try {
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }

      const updateData: any = { ...dto };

      if (dto.name) {
        updateData.slug = slugify(dto.name, { lower: true });
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (!updatedCategory) {
        throw new ApiError(404, 'Category not found');
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category');
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await CategoryModel.findByIdAndDelete(id);
      if (!result) {
        throw new ApiError(404, 'Category not found');
      }
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting category');
    }
  }

  async updateCategoryStatus(id: string, isActive: boolean): Promise<any> {
    try {
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        throw new ApiError(404, 'Category not found');
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true, runValidators: true }
      );

      if (!updatedCategory) {
        throw new ApiError(404, 'Category not found');
      }

      return updatedCategory;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating category status');
    }
  }

  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await CategoryModel.find({ isActive: true });
      return categories.map((category: any) => category.name);
    } catch (error) {
      throw new ApiError(500, 'Error fetching category names');
    }
  }
}
