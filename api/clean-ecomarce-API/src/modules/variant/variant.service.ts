import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import {
  generateCombinations,
  buildCombinationKey,
} from '../product/product.variant.utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OptionTypeInput {
  name: string;
  values: string[];
}

export interface VariantUpdateInput {
  price?: number;
  stock?: number;
  sku?: string;
  isActive?: boolean;
  images?: string[];
}

export interface BulkVariantUpdateInput {
  id: string;
  price?: number;
  stock?: number;
  sku?: string;
  isActive?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVariant(combo: any) {
  return {
    id: combo.id,
    productId: combo.productId,
    price: combo.price ?? null,
    stock: combo.stock ?? 0,
    sku: combo.sku ?? null,
    images: combo.images ?? [],
    isActive: combo.isActive ?? true,
    combination: (combo.selections ?? []).map((s: any) => ({
      optionType: s.groupName,
      value: s.value,
    })),
  };
}

/** Stable, short SKU built from product name + value slugs + cuid suffix. */
function autoSku(productName: string, selections: Record<string, string>): string {
  const base = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 8)
    .replace(/^-|-$/g, '');

  const vals = Object.values(selections)
    .map((v) => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
    .join('-');

  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}-${vals}-${suffix}`;
}

// ─── VariantService ───────────────────────────────────────────────────────────

export class VariantService {
  /**
   * PUT /products/:id/options
   * Replace all option types for a product and reconcile variants:
   *  - Matching combinations (same sorted option values) are preserved.
   *  - New combinations are inserted with auto-generated SKU.
   *  - Removed combinations are deleted.
   */
  async setOptionTypes(productId: string, optionTypes: OptionTypeInput[]) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new ApiError(404, 'Product not found');

      // Snapshot existing combinations with their selections.
      const existingCombos = await tx.productVariantCombination.findMany({
        where: { productId },
        include: { selections: true },
      });

      // Build a key → combo map for fast lookup.
      const existingByKey = new Map<string, (typeof existingCombos)[0]>();
      for (const c of existingCombos) {
        const sel = Object.fromEntries(c.selections.map((s) => [s.groupName, s.value]));
        existingByKey.set(buildCombinationKey(sel), c);
      }

      // Drop all existing option groups (cascades to ProductVariantOption rows).
      await tx.productVariantGroup.deleteMany({ where: { productId } });

      if (!optionTypes.length) {
        await tx.productVariantCombination.deleteMany({ where: { productId } });
        const updated = await tx.product.update({
          where: { id: productId },
          data: { hasVariants: false, useVariantStock: false, useVariantPricing: false },
          include: {
            variantGroups: { include: { options: true } },
            variantCombinations: { include: { selections: true } },
          },
        });
        return { product: updated, variants: [] };
      }

      // Insert new option types + values.
      for (const ot of optionTypes) {
        await tx.productVariantGroup.create({
          data: {
            productId,
            name: ot.name.trim(),
            options: {
              create: ot.values
                .filter((v) => v.trim())
                .map((v) => ({ value: v.trim() })),
            },
          },
        });
      }

      // Generate full Cartesian product of the new option values.
      const groups = optionTypes.map((ot) => ({
        name: ot.name.trim(),
        options: ot.values.filter((v) => v.trim()),
      }));
      const newSelections = generateCombinations(groups);

      const newKeys = new Set<string>();

      for (const sel of newSelections) {
        const key = buildCombinationKey(sel);
        newKeys.add(key);

        if (!existingByKey.has(key)) {
          await tx.productVariantCombination.create({
            data: {
              productId,
              price: product.price,
              stock: 0,
              sku: autoSku(product.name, sel),
              isActive: true,
              images: [],
              selections: {
                create: Object.entries(sel).map(([groupName, value]) => ({
                  groupName,
                  value,
                })),
              },
            },
          });
        }
      }

      // Delete variants whose combination no longer exists.
      for (const [key, combo] of existingByKey) {
        if (!newKeys.has(key)) {
          await tx.productVariantCombination.delete({ where: { id: combo.id } });
        }
      }

      // Mark product as having variants.
      await tx.product.update({
        where: { id: productId },
        data: { hasVariants: true, useVariantStock: true, useVariantPricing: true },
      });

      const variants = await tx.productVariantCombination.findMany({
        where: { productId },
        include: { selections: true },
        orderBy: { id: 'asc' },
      });

      const updatedProduct = await tx.product.findUnique({
        where: { id: productId },
        include: {
          variantGroups: { include: { options: true } },
        },
      });

      return { product: updatedProduct, variants: variants.map(formatVariant) };
    });
  }

  /** GET /products/:id/variants */
  async getVariants(productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, 'Product not found');

    const combos = await prisma.productVariantCombination.findMany({
      where: { productId },
      include: { selections: true },
      orderBy: { id: 'asc' },
    });
    return combos.map(formatVariant);
  }

  /** GET /variants/:variantId */
  async getVariant(variantId: string) {
    const combo = await prisma.productVariantCombination.findUnique({
      where: { id: variantId },
      include: { selections: true },
    });
    if (!combo) throw new ApiError(404, 'Variant not found');
    return formatVariant(combo);
  }

  /** PUT /variants/:variantId */
  async updateVariant(variantId: string, data: VariantUpdateInput) {
    const existing = await prisma.productVariantCombination.findUnique({
      where: { id: variantId },
    });
    if (!existing) throw new ApiError(404, 'Variant not found');

    if (data.sku && data.sku !== existing.sku) {
      const conflict = await prisma.productVariantCombination.findUnique({
        where: { sku: data.sku },
      });
      if (conflict) throw new ApiError(409, 'SKU already in use by another variant');
    }

    const updated = await prisma.productVariantCombination.update({
      where: { id: variantId },
      data: {
        ...(data.price !== undefined ? { price: Number(data.price) } : {}),
        ...(data.stock !== undefined ? { stock: Number(data.stock) } : {}),
        ...(data.sku !== undefined ? { sku: data.sku.trim() } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.images !== undefined ? { images: data.images } : {}),
      },
      include: { selections: true },
    });
    return formatVariant(updated);
  }

  /** PUT /products/:id/variants/bulk */
  async bulkUpdateVariants(productId: string, variants: BulkVariantUpdateInput[]) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, 'Product not found');

    return prisma.$transaction(async (tx) => {
      const results = [];
      for (const v of variants) {
        const existing = await tx.productVariantCombination.findFirst({
          where: { id: v.id, productId },
        });
        if (!existing) continue;

        if (v.sku && v.sku !== existing.sku) {
          const conflict = await tx.productVariantCombination.findFirst({
            where: { sku: v.sku, NOT: { id: v.id } },
          });
          if (conflict) throw new ApiError(409, `SKU "${v.sku}" is already used`);
        }

        const updated = await tx.productVariantCombination.update({
          where: { id: v.id },
          data: {
            ...(v.price !== undefined ? { price: Number(v.price) } : {}),
            ...(v.stock !== undefined ? { stock: Number(v.stock) } : {}),
            ...(v.sku !== undefined ? { sku: v.sku.trim() } : {}),
            ...(v.isActive !== undefined ? { isActive: v.isActive } : {}),
          },
          include: { selections: true },
        });
        results.push(formatVariant(updated));
      }
      return results;
    });
  }

  /** DELETE /variants/:variantId */
  async deleteVariant(variantId: string) {
    const existing = await prisma.productVariantCombination.findUnique({
      where: { id: variantId },
    });
    if (!existing) throw new ApiError(404, 'Variant not found');
    await prisma.productVariantCombination.delete({ where: { id: variantId } });
  }
}
