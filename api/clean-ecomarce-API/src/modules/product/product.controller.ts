import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { ApiResponse } from '../../utils/ApiResponse';
import logger from '../../config/logger';

function parseProductBody(body: Record<string, unknown>): Record<string, unknown> {
  const parsed = { ...body };

  if (parsed.hasVariants !== undefined) {
    parsed.hasVariants = parsed.hasVariants === true || parsed.hasVariants === 'true';
  }
  if (parsed.useVariantStock !== undefined) {
    parsed.useVariantStock = parsed.useVariantStock === true || parsed.useVariantStock === 'true';
  }
  if (parsed.useVariantPricing !== undefined) {
    parsed.useVariantPricing =
      parsed.useVariantPricing === true || parsed.useVariantPricing === 'true';
  }

  for (const field of ['variantGroups', 'variantCombinations']) {
    if (typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field] as string);
      } catch {
        // keep original string; service will fall back to []
      }
    }
  }

  return parsed;
}

export class ProductController {
  constructor(private productService: ProductService) {
    logger.info('Product controller initialized');
  }

  async getAllProducts(req: Request, res: Response) {
    const products = await this.productService.getAllProducts();
    return res.json(new ApiResponse(200, products, 'Products retrieved successfully'));
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await this.productService.getProductById(id);
    return res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
  }

  async createProduct(req: Request, res: Response) {
    try {
      const categoryName = req.body.category;
      logger.info(`Creating product in category: ${categoryName}`);
      const categoryId = await this.productService.getCategoryId(categoryName);
      if (!categoryId) {
        logger.warn(`Category not found: ${categoryName}`);
        return res.status(400).json({ message: 'Invalid category' });
      }

      const productData = parseProductBody({
        ...req.body,
        category: categoryId,
      });

      const product = await this.productService.createProduct(productData);
      return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
    } catch (error) {
      return res.status(500).json({ message: 'Error creating product', error });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = parseProductBody({ ...req.body });

      if (body.category && typeof body.category === 'string') {
        const categoryId = await this.productService.getCategoryId(body.category as string);
        if (!categoryId) {
          return res.status(400).json({ message: 'Invalid category' });
        }
        body.category = categoryId;
      }

      const product = await this.productService.updateProduct(id, body);
      return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error updating product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    await this.productService.deleteProduct(id);
    return res.status(200).json({ message: 'Product deleted successfully' });
  }
}
