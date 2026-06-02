import slugify from 'slugify';
import { prisma } from '../../config/database';
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
import { IVariantGroup, IVariantCombination } from './product.model';

export type { ProductWithUrls } from './product.types';

// ─── Prisma include shape used throughout ────────────────────────────────────

export const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true } },
  variantGroups: {
    include: { options: { select: { id: true, value: true } } },
  },
  variantCombinations: {
    include: {
      selections: { select: { id: true, groupName: true, value: true } },
    },
  },
} as const;

// ─── DB row → utility-friendly shapes ────────────────────────────────────────

export function dbToVariantGroups(dbGroups: any[]): IVariantGroup[] {
  return (dbGroups ?? []).map((g: any) => ({
    name: g.name,
    options: (g.options ?? []).map((o: any) => o.value),
  }));
}

export function dbToVariantCombinations(dbCombos: any[]): IVariantCombination[] {
  return (dbCombos ?? []).map((c: any) => ({
    selections: Object.fromEntries(
      (c.selections ?? []).map((s: any) => [s.groupName, s.value])
    ),
    stock: c.stock ?? undefined,
    price: c.price ?? undefined,
  }));
}

/** Convert a Prisma product row (with includes) into the plain shape
 *  expected by validateVariantSelection / resolveItemPrice / getAvailableStock. */
export function toProductPlain(prismaProduct: any): any {
  return {
    ...prismaProduct,
    variantGroups: dbToVariantGroups(prismaProduct.variantGroups ?? []),
    variantCombinations: dbToVariantCombinations(prismaProduct.variantCombinations ?? []),
  };
}

// ─── ProductService ───────────────────────────────────────────────────────────

export class ProductService {
  constructor() {
    logger.info('ProductService initialized');
  }

  // ── Variant utilities (work on plain product objects) ─────────────────────

  validateVariantSelection(product: any, selectedVariants?: Record<string, string>): void {
    if (!product.hasVariants) return;

    const selections = normalizeSelections(selectedVariants as any);
    const groups: VariantGroup[] = product.variantGroups || [];

    if (!groups.length) throw new Error('Product variants are not configured');

    for (const group of groups) {
      if (!selections[group.name]) throw new Error(`Please select ${group.name}`);
      if (!group.options.includes(selections[group.name])) {
        throw new Error(`Invalid option for ${group.name}`);
      }
    }

    if (!findCombination(product.variantCombinations, selections)) {
      throw new Error('Invalid variant combination');
    }
  }

  getAvailableStock(product: any, selectedVariants?: Record<string, string>): number {
    if (!product.hasVariants || !product.useVariantStock) return product.stock ?? 0;

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
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variantCombinations: {
          include: { selections: true },
        },
      },
    });
    if (!product) throw new Error('Product not found');

    if (product.hasVariants && product.useVariantStock) {
      const selections = normalizeSelections(selectedVariants as any);
      const combos = dbToVariantCombinations(product.variantCombinations);
      const combo = findCombination(combos, selections);
      if (!combo || (combo.stock ?? 0) < quantity) {
        throw new Error('Insufficient stock for selected variant');
      }

      // Find the DB combination that matches these selections
      const dbCombo = product.variantCombinations.find((c: any) => {
        const sel = Object.fromEntries(c.selections.map((s: any) => [s.groupName, s.value]));
        return JSON.stringify(Object.keys(sel).sort().map(k => `${k}:${sel[k]}`)) ===
               JSON.stringify(Object.keys(selections).sort().map(k => `${k}:${selections[k]}`));
      });

      if (!dbCombo) throw new Error('Variant combination not found in DB');

      await prisma.productVariantCombination.update({
        where: { id: dbCombo.id },
        data: { stock: (combo.stock ?? 0) - quantity },
      });
      return;
    }

    const newStock = (product.stock || 0) - quantity;
    if (newStock < 0) throw new Error('Insufficient stock');
    await prisma.product.update({ where: { id: productId }, data: { stock: newStock } });
  }

  // ── Variant DB write helpers ──────────────────────────────────────────────

  private buildVariantCreateData(
    variantGroups: VariantGroup[],
    variantCombinations: VariantCombination[]
  ) {
    return {
      variantGroups: {
        create: variantGroups.map((g) => ({
          name: g.name,
          options: {
            create: g.options.map((value) => ({ value })),
          },
        })),
      },
      variantCombinations: {
        create: variantCombinations.map((combo) => ({
          stock: combo.stock ?? null,
          price: combo.price ?? null,
          selections: {
            create: Object.entries(combo.selections).map(([groupName, value]) => ({
              groupName,
              value,
            })),
          },
        })),
      },
    };
  }

  private parseBoolean(value: unknown, fallback = false): boolean {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return fallback;
  }

  private parseJsonField<T>(value: unknown, fallback: T): T {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'string') {
      try { return JSON.parse(value) as T; } catch { return fallback; }
    }
    return value as T;
  }

  private normalizeVariantGroups(groups: unknown): VariantGroup[] {
    const parsed = this.parseJsonField<VariantGroup[]>(groups, []);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((g) => ({
        name: String(g.name || '').trim(),
        options: Array.isArray(g.options)
          ? g.options.map((o) => String(o).trim()).filter(Boolean)
          : [],
      }))
      .filter((g) => g.name && g.options.length > 0);
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
      return {
        ...prepared,
        hasVariants: false,
        variantGroups: [],
        variantCombinations: [],
        useVariantStock: false,
        useVariantPricing: false,
      };
    }

    const variantGroups = this.normalizeVariantGroups(
      prepared.variantGroups ?? existing?.variantGroups
    );
    const useVariantStock = this.parseBoolean(
      prepared.useVariantStock, existing?.useVariantStock ?? false
    );
    const useVariantPricing = this.parseBoolean(
      prepared.useVariantPricing, existing?.useVariantPricing ?? false
    );
    const incomingCombinations = this.normalizeVariantCombinations(prepared.variantCombinations);
    const existingCombinations = existing?.variantCombinations ?? [];

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

    return { ...prepared, hasVariants: true, variantGroups, useVariantStock, useVariantPricing, variantCombinations };
  }

  // ── Image URL helpers ─────────────────────────────────────────────────────

  private async addImageUrls(product: any): Promise<ProductWithUrls> {
    try {
      const imageUrls = await Promise.all(
        (product.images ?? []).map((key: string) => getSignedFileUrl(key))
      );
      return this.formatProductResponse(product, imageUrls);
    } catch {
      return this.formatProductResponse(product, []);
    }
  }

  private async addImageUrlsToProducts(products: any[]): Promise<ProductWithUrls[]> {
    return Promise.all(products.map((p) => this.addImageUrls(p)));
  }

  async formatProductsForStore(products: any[]): Promise<ProductWithUrls[]> {
    return this.addImageUrlsToProducts(products);
  }

  async formatProductForStore(product: any): Promise<ProductWithUrls> {
    return this.addImageUrls(product);
  }

  private formatProductResponse(product: any, imageUrls: string[]): ProductWithUrls {
    const categoryName =
      product.category && typeof product.category === 'object'
        ? product.category.name
        : product.category;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      category: categoryName ?? null,
      images: product.images ?? [],
      imageUrls,
      status: product.status,
      hasVariants: product.hasVariants,
      variantGroups: dbToVariantGroups(product.variantGroups ?? []),
      useVariantStock: product.useVariantStock,
      useVariantPricing: product.useVariantPricing,
      variantCombinations: dbToVariantCombinations(product.variantCombinations ?? []),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async getAllProducts(): Promise<ProductWithUrls[]> {
    const products = await prisma.product.findMany({ include: PRODUCT_INCLUDE });
    return this.addImageUrlsToProducts(products);
  }

  async getProductById(id: string): Promise<ProductWithUrls> {
    const product = await prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
    if (!product) throw new Error('Product not found');
    return this.addImageUrls(product);
  }

  async createProduct(data: any): Promise<ProductWithUrls> {
    logger.info('createProduct in service');

    const categoryId = data.category ?? data.categoryId;
    const hasVariants = this.parseBoolean(data.hasVariants, false);
    const slug = slugify(data.name ?? '', { lower: true });

    const variantData = hasVariants
      ? this.prepareProductData(data)
      : { hasVariants: false, variantGroups: [], variantCombinations: [], useVariantStock: false, useVariantPricing: false };

    const variantGroups: VariantGroup[] = variantData.variantGroups;
    const variantCombinations: VariantCombination[] = variantData.variantCombinations;

    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        categoryId,
        images: Array.isArray(data.images) ? data.images : [],
        status: data.status ?? 'ACTIVE',
        hasVariants: variantData.hasVariants,
        useVariantStock: variantData.useVariantStock,
        useVariantPricing: variantData.useVariantPricing,
        ...this.buildVariantCreateData(variantGroups, variantCombinations),
      },
      include: PRODUCT_INCLUDE,
    });

    return this.addImageUrls(created);
  }

  async updateProduct(id: string, data: any): Promise<ProductWithUrls> {
    const existing = await prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
    if (!existing) throw new Error('Product not found');

    const existingPlain = toProductPlain(existing);
    const prepared = this.prepareProductData(data, existingPlain);

    const categoryId = data.category ?? data.categoryId ?? existing.categoryId;

    const variantGroups: VariantGroup[] = prepared.variantGroups ?? [];
    const variantCombinations: VariantCombination[] = prepared.variantCombinations ?? [];

    // Delete then recreate all variant rows on update
    await prisma.productVariantGroup.deleteMany({ where: { productId: id } });
    await prisma.productVariantCombination.deleteMany({ where: { productId: id } });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        slug: data.name ? slugify(data.name, { lower: true }) : existing.slug,
        price: data.price !== undefined ? Number(data.price) : existing.price,
        stock: data.stock !== undefined ? Number(data.stock) : existing.stock,
        categoryId,
        images: Array.isArray(data.images) ? data.images : existing.images,
        status: data.status ?? existing.status,
        hasVariants: prepared.hasVariants,
        useVariantStock: prepared.useVariantStock,
        useVariantPricing: prepared.useVariantPricing,
        ...this.buildVariantCreateData(variantGroups, variantCombinations),
      },
      include: PRODUCT_INCLUDE,
    });

    return this.addImageUrls(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');
    await prisma.product.delete({ where: { id } });
  }

  async updateStock(id: string, quantity: number): Promise<ProductWithUrls> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');

    const newStock = (product.stock || 0) + quantity;
    if (newStock < 0) throw new Error('Insufficient stock');

    const updated = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: PRODUCT_INCLUDE,
    });
    return this.addImageUrls(updated);
  }

  async updateProductStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<ProductWithUrls> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');

    const updated = await prisma.product.update({
      where: { id },
      data: { status },
      include: PRODUCT_INCLUDE,
    });
    return this.addImageUrls(updated);
  }

  async getCategoryId(categoryName: string): Promise<string | null> {
    logger.info(`Fetching category ID for category name: ${categoryName}`);
    const category = await prisma.category.findFirst({ where: { name: categoryName } });
    return category ? category.id : null;
  }
}
