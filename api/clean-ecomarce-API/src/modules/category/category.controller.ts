import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { ApiResponse } from '../../utils/ApiResponse';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body;
      const category = await this.categoryService.createCategory(dto);
      res.status(201).json(new ApiResponse(201, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.json(new ApiResponse(200, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(new ApiResponse(200, categories));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto = req.body;
      const category = await this.categoryService.updateCategory(id, dto);
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.json(new ApiResponse(200, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const success = await this.categoryService.deleteCategory(id);
      if (!success) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateCategoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const category = await this.categoryService.updateCategoryStatus(id, isActive);
      res.json(new ApiResponse(200, category));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCategoryNames(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getCategoryNames();
      res.json(new ApiResponse(200, categories));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
