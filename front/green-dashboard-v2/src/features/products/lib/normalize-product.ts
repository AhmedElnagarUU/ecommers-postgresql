import { withLegacyId } from '@/shared/lib/normalize-id';
import type { Product } from '../types';

function toUiStatus(status: unknown): 'active' | 'inactive' {
  return String(status ?? 'ACTIVE').toUpperCase() === 'ACTIVE' ? 'active' : 'inactive';
}

export function normalizeProduct(raw: Record<string, unknown>): Product {
  const base = withLegacyId(raw);
  const category = raw.category;
  return {
    ...base,
    name: String(raw.name ?? ''),
    description: String(raw.description ?? ''),
    price: Number(raw.price) || 0,
    stock: Number(raw.stock) || 0,
    category:
      typeof category === 'object' && category !== null && 'name' in category
        ? String((category as { name: string }).name)
        : String(category ?? ''),
    images: Array.isArray(raw.images) ? (raw.images as string[]) : [],
    imageUrls: raw.imageUrls ?? [],
    status: toUiStatus(raw.status),
    hasVariants: Boolean(raw.hasVariants),
    variantGroups: raw.variantGroups as Product['variantGroups'],
    useVariantStock: Boolean(raw.useVariantStock),
    useVariantPricing: Boolean(raw.useVariantPricing),
    variantCombinations: raw.variantCombinations as Product['variantCombinations'],
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

export function normalizeProducts(raw: Record<string, unknown>[]): Product[] {
  return raw.map(normalizeProduct);
}

export function productStatusToApi(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'ACTIVE' : 'INACTIVE';
}
