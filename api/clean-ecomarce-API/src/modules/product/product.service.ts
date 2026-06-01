import { Product } from './product.model';
import { Category } from '../category/category.model';
import { getSignedFileUrl } from '../../middleware/upload.middleware';
import logger from '../../config/logger';
import {
  VariantCombination,
  VariantGroup,
  findCombination,
  mergeCombinationUpdates,
  normalizeSelections,
  syncVariantCombinations,
} from './product.variant.utils';
import { ProductWithUrls } from './product.types';

export type { ProductWithUrls } from './product.types';

export class ProductService {
  constructor() {
    logger.info('ProductService initialized');
  }

  /** Resolve populated category document to category name string */
  private toCategoryName(category: unknown): string | null {
    if (!category) return null;
    if (typeof category === 'object' && category !== null && 'name' in category) {
      return String((category as { name: string }).name);
    }
    return null;
  }

  private formatVariantFields(plain: Record<string, unknown>): Record<string, unknown> {
    if (!plain.hasVariants) {
      return plain;
    }

    if (Array.isArray(plain.variantCombinations)) {
      plain.variantCombinations = plain.variantCombinations.map((combo: any) => ({
        ...combo,
        selections: normalizeSelections(combo.selections),
      }));
    }

    return plain;
  }

  private formatProductResponse(product: any, imageUrls: string[]): ProductWithUrls {
    const plain = product.toObject ? product.toObject() : { ...product };
    const categoryName = this.toCategoryName(plain.category);
    const formatted = {
      ...this.formatVariantFields(plain),
      _id: String(plain._id ?? product._id),
      category: categoryName ?? plain.category,
      imageUrls,
    };
    return formatted as ProductWithUrls;
  }

  private parseBoolean(value: unknown, fallback = false): boolean {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return fallback;
  }

  private parseJsonField<T>(value: unknown, fallback: T): T {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }
    return value as T;
  }

  private normalizeVariantGroups(groups: unknown): VariantGroup[] {
    const parsed = this.parseJsonField<VariantGroup[]>(groups, []);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((group) => ({
        name: String(group.name || '').trim(),
        options: Array.isArray(group.options)
          ? group.options.map((option) => String(option).trim()).filter(Boolean)
          : [],
      }))
      .filter((group) => group.name && group.options.length > 0);
  }

  private normalizeVariantCombinations(combinations: unknown): VariantCombination[] {
    const parsed = this.parseJsonField<VariantCombination[]>(combinations, []);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((combo) => ({
      selections: normalizeSelections(combo.selections as any),
      stock: combo.stock !== undefined ? Number(combo.stock) : undefined,
      price: combo.price !== undefined ? Number(combo.price) : undefined,
    }));
  }

  prepareProductData(data: any, existing?: any): any {
    const prepared = { ...data };
    const hasVariants = this.parseBoolean(prepared.hasVariants, false);

    if (!hasVariants) {
      prepared.hasVariants = false;
      prepared.variantGroups = [];
      prepared.variantCombinations = [];
      prepared.useVariantStock = false;
      prepared.useVariantPricing = false;
      return prepared;
    }

    const variantGroups = this.normalizeVariantGroups(
      prepared.variantGroups ?? existing?.variantGroups
    );
    const useVariantStock = this.parseBoolean(
      prepared.useVariantStock,
      existing?.useVariantStock ?? false
    );
    const useVariantPricing = this.parseBoolean(
      prepared.useVariantPricing,
      existing?.useVariantPricing ?? false
    );
    const incomingCombinations = this.normalizeVariantCombinations(
      prepared.variantCombinations
    );
    const existingCombinations = (existing?.variantCombinations || []).map((combo: any) => ({
      selections: normalizeSelections(combo.selections),
      stock: combo.stock,
      price: combo.price,
    }));

    let variantCombinations = syncVariantCombinations(
      variantGroups,
      incomingCombinations.length ? incomingCombinations : existingCombinations,
      useVariantStock,
      useVariantPricing
    );

    if (incomingCombinations.length) {
      variantCombinations = mergeCombinationUpdates(
        variantCombinations,
        incomingCombinations,
        useVariantStock,
        useVariantPricing
      );
    }

    prepared.hasVariants = true;
    prepared.variantGroups = variantGroups;
    prepared.useVariantStock = useVariantStock;
    prepared.useVariantPricing = useVariantPricing;
    prepared.variantCombinations = variantCombinations;

    return prepared;
  }

  validateVariantSelection(product: any, selectedVariants?: Record<string, string>): void {
    if (!product.hasVariants) return;

    const selections = normalizeSelections(selectedVariants as any);
    const groups: VariantGroup[] = product.variantGroups || [];

    if (!groups.length) {
      throw new Error('Product variants are not configured');
    }

    for (const group of groups) {
      if (!selections[group.name]) {
        throw new Error(`Please select ${group.name}`);
      }
      if (!group.options.includes(selections[group.name])) {
        throw new Error(`Invalid option for ${group.name}`);
      }
    }

    if (!findCombination(product.variantCombinations, selections)) {
      throw new Error('Invalid variant combination');
    }
  }

  getAvailableStock(product: any, selectedVariants?: Record<string, string>): number {
    if (!product.hasVariants || !product.useVariantStock) {
      return product.stock ?? 0;
    }

    const combo = findCombination(
      product.variantCombinations,
      normalizeSelections(selectedVariants as any)
    );
    return combo?.stock ?? 0;
  }

  resolveItemPrice(product: any, selectedVariants?: Record<string, string>): number {
    if (product.hasVariants && product.useVariantPricing) {
      const combo = findCombination(
        product.variantCombinations,
        normalizeSelections(selectedVariants as any)
      );
      if (combo?.price !== undefined) return combo.price;
    }
    return product.price ?? 0;
  }

  async decrementStock(
    productId: string,
    quantity: number,
    selectedVariants?: Record<string, string>
  ): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    if (product.hasVariants && product.useVariantStock) {
      const selections = normalizeSelections(selectedVariants as any);
      const combinations = (product.variantCombinations || []).map((combo: any) => ({
        selections: normalizeSelections(combo.selections),
        stock: combo.stock,
        price: combo.price,
      }));
      const combo = findCombination(combinations, selections);
      if (!combo || (combo.stock ?? 0) < quantity) {
        throw new Error('Insufficient stock for selected variant');
      }
      combo.stock = (combo.stock ?? 0) - quantity;
      product.variantCombinations = combinations.map((entry) => ({
        selections: new Map(Object.entries(entry.selections)),
        stock: entry.stock,
        price: entry.price,
      })) as any;
      await product.save();
      return;
    }

    const newStock = (product.stock || 0) - quantity;
    if (newStock < 0) throw new Error('Insufficient stock');
    product.stock = newStock;
    await product.save();
  }

  /** Add signed URLs to a single product */
  private async addImageUrls(product: any): Promise<ProductWithUrls> {
    try {
      const imageUrls = await Promise.all(
        product.images.map((key: string) => getSignedFileUrl(key))
      );
      return this.formatProductResponse(product, imageUrls);
    } catch (error) {
      console.error('Error generating image URLs:', error);
      return this.formatProductResponse(product, []);
    }
  }

  /** Add signed URLs to multiple products */
  private async addImageUrlsToProducts(products: any[]): Promise<ProductWithUrls[]> {
    return Promise.all(products.map(p => this.addImageUrls(p)));
  }

  /** Public helpers for storefront */
  async formatProductsForStore(products: any[]): Promise<ProductWithUrls[]> {
    return this.addImageUrlsToProducts(products);
  }

  async formatProductForStore(product: any): Promise<ProductWithUrls> {
    return this.addImageUrls(product);
  }

  /** Fetch all products */
  async getAllProducts(query?: any): Promise<any[]> {
    const products = await Product.find().populate('category', 'name');
    return this.addImageUrlsToProducts(products);
  }

  /** Fetch a single product by ID */
  async getProductById(id: string): Promise<ProductWithUrls> {
    const product = await Product.findById(id).populate('category', 'name');
    if (!product) throw new Error('Product not found');
    return this.addImageUrls(product);
  }

  /** Create a new product */
  async createProduct(data: any): Promise<ProductWithUrls> {
    logger.info('createProduct in servise')
    const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const productData = this.prepareProductData({ ...data, sku });
    const createdProduct = await Product.create(productData);
    await createdProduct.populate('category', 'name');
    return this.addImageUrls(createdProduct);
  }

  /** Update an existing product */
  async updateProduct(id: string, data: any): Promise<ProductWithUrls> {
    const existing = await Product.findById(id);
    if (!existing) throw new Error('Product not found');

    const productData = this.prepareProductData(data, existing);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    if (!updatedProduct) throw new Error('Product not found');
    return this.addImageUrls(updatedProduct);
  }

  /** Delete a product */
  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    await Product.findByIdAndDelete(id);
  }

  /** Update stock quantity */
  async updateStock(id: string, quantity: number): Promise<ProductWithUrls> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    const newStock = (product.stock || 0) + quantity;
    if (newStock < 0) throw new Error('Insufficient stock');

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { stock: newStock } },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    if (!updatedProduct) throw new Error('Failed to update stock');
    return this.addImageUrls(updatedProduct);
  }

  /** Update product status */
  async updateProductStatus(id: string, status: 'active' | 'inactive'): Promise<ProductWithUrls> {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    if (!updatedProduct) throw new Error('Failed to update status');
    return this.addImageUrls(updatedProduct);
  }

  async getCategoryId(categoryName: string): Promise<any> {
    logger.info(`Fetching category ID for category name: ${categoryName}`);
    const category = await Category.findOne({ name: categoryName });
    logger.info(`category: ${category}`);
    logger.info(`categoryId: ${category ? category._id : 'Not Found'}`);
    return category ? category._id : null;
  }
}
