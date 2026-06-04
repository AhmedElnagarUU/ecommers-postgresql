import { withLegacyId } from '@/shared/lib/normalize-id';
import type { Order, OrderItem, OrderStatus } from '../types';

export function toUiStatus(status: string): OrderStatus {
  const normalized = status.toLowerCase();
  if (
    normalized === 'pending' ||
    normalized === 'processing' ||
    normalized === 'completed' ||
    normalized === 'cancelled'
  ) {
    return normalized;
  }
  return 'pending';
}

export function toApiStatus(status: OrderStatus): string {
  return status.toUpperCase();
}

function normalizeOrderItem(item: Record<string, unknown>): OrderItem {
  const product = item.product as Record<string, unknown> | undefined;
  return {
    product: product
      ? (withLegacyId(product) as OrderItem['product'])
      : { _id: '', id: '', name: 'Product', images: [], price: 0 },
    quantity: Number(item.quantity) || 0,
    price: Number(item.price) || 0,
    selectedVariants: item.selectedVariants as Record<string, string> | undefined,
  };
}

export function normalizeOrder(raw: Record<string, unknown>): Order {
  const base = withLegacyId(raw);
  const customer = raw.customer as Record<string, unknown> | undefined;
  const shipping = raw.shippingAddress as Record<string, unknown> | undefined;

  return {
    ...base,
    orderNumber: String(raw.orderNumber ?? ''),
    customer: customer
      ? (withLegacyId(customer) as Order['customer'])
      : { _id: '', id: '', name: '', email: '' },
    customerName: String(customer?.name ?? ''),
    customerEmail: String(customer?.email ?? ''),
    customerPhone: String(shipping?.phone ?? customer?.phone ?? ''),
    items: Array.isArray(raw.items)
      ? (raw.items as Record<string, unknown>[]).map(normalizeOrderItem)
      : [],
    totalAmount: Number(raw.totalAmount) || 0,
    total: Number(raw.totalAmount) || Number(raw.total) || 0,
    status: toUiStatus(String(raw.status ?? 'PENDING')),
    paymentStatus: String(raw.paymentStatus ?? 'PENDING').toLowerCase() as Order['paymentStatus'],
    shippingAddress: (shipping ?? {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
    }) as Order['shippingAddress'],
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

export function normalizeOrders(raw: Record<string, unknown>[]): Order[] {
  return raw.map(normalizeOrder);
}
