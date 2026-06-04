import { withLegacyId } from '@/shared/lib/normalize-id';
import type { Cart, Category, Order, Product } from './types';

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
    imageUrls: Array.isArray(raw.imageUrls) ? (raw.imageUrls as string[]) : [],
    hasVariants: Boolean(raw.hasVariants),
    variantGroups: raw.variantGroups as Product['variantGroups'],
    useVariantStock: Boolean(raw.useVariantStock),
    useVariantPricing: Boolean(raw.useVariantPricing),
    variantCombinations: raw.variantCombinations as Product['variantCombinations'],
  };
}

export function normalizeProducts(raw: Record<string, unknown>[]): Product[] {
  return raw.map(normalizeProduct);
}

export function normalizeCategory(raw: Record<string, unknown>): Category {
  return withLegacyId({
    ...raw,
    name: String(raw.name ?? ''),
    slug: String(raw.slug ?? ''),
    description: raw.description ? String(raw.description) : undefined,
  }) as Category;
}

export function normalizeCategories(raw: Record<string, unknown>[]): Category[] {
  return raw.map(normalizeCategory);
}

export function normalizeOrder(raw: Record<string, unknown>): Order {
  return withLegacyId({
    ...raw,
    orderNumber: String(raw.orderNumber ?? ''),
    totalAmount: Number(raw.totalAmount) || 0,
    status: String(raw.status ?? ''),
    paymentStatus: String(raw.paymentStatus ?? ''),
  }) as Order;
}

export function normalizeOrders(raw: Record<string, unknown>[]): Order[] {
  return raw.map(normalizeOrder);
}

export function normalizeCart(raw: Record<string, unknown>): Cart {
  const base = withLegacyId(raw);
  return {
    ...base,
    items: Array.isArray(raw.items) ? (raw.items as Cart['items']) : [],
    totalPrice: Number(raw.totalPrice) || 0,
  };
}
