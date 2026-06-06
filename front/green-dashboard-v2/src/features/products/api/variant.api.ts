import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OptionTypeInput {
  name: string;
  values: string[];
}

export interface VariantRow {
  id: string;
  productId: string;
  price: number | null;
  stock: number;
  sku: string | null;
  images: string[];
  isActive: boolean;
  combination: { optionType: string; value: string }[];
}

export interface BulkVariantUpdate {
  id: string;
  price?: number;
  stock?: number;
  sku?: string;
  isActive?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Auto-suggests a SKU from product name + combination values. */
export function suggestSku(productName: string, combination: { optionType: string; value: string }[]): string {
  const base = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 8)
    .replace(/^-|-$/g, '');
  const vals = combination
    .map((c) => c.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
    .join('-');
  return `${base}-${vals}`;
}

/** Label shown in the Variants Table for a row (e.g. "Red / S"). */
export function combinationLabel(combination: { optionType: string; value: string }[]): string {
  return combination.map((c) => c.value).join(' / ') || '—';
}

// ─── API calls ────────────────────────────────────────────────────────────────

class VariantApiService {
  /** PUT /products/:id/options — replace option types, reconcile variants. */
  async setOptionTypes(
    productId: string,
    optionTypes: OptionTypeInput[]
  ): Promise<{ variants: VariantRow[] }> {
    const res = await api.put<ApiResponse<{ variants: VariantRow[] }>>(
      `/products/${productId}/options`,
      { optionTypes },
      { withCredentials: true }
    );
    if (!res.data?.data) throw new Error('Invalid response from setOptionTypes');
    return res.data.data;
  }

  /** GET /products/:id/variants */
  async getVariants(productId: string): Promise<VariantRow[]> {
    const res = await api.get<ApiResponse<VariantRow[]>>(
      `/products/${productId}/variants`,
      { withCredentials: true }
    );
    if (!res.data?.data) throw new Error('Invalid response from getVariants');
    return res.data.data;
  }

  /** PUT /products/:id/variants/bulk */
  async bulkUpdate(productId: string, variants: BulkVariantUpdate[]): Promise<VariantRow[]> {
    const res = await api.put<ApiResponse<VariantRow[]>>(
      `/products/${productId}/variants/bulk`,
      { variants },
      { withCredentials: true }
    );
    if (!res.data?.data) throw new Error('Invalid response from bulkUpdate');
    return res.data.data;
  }

  /** GET /variants/:variantId */
  async getVariant(variantId: string): Promise<VariantRow> {
    const res = await api.get<ApiResponse<VariantRow>>(
      `/variants/${variantId}`,
      { withCredentials: true }
    );
    if (!res.data?.data) throw new Error('Invalid response from getVariant');
    return res.data.data;
  }

  /** PUT /variants/:variantId */
  async updateVariant(
    variantId: string,
    data: Partial<Pick<VariantRow, 'price' | 'stock' | 'sku' | 'isActive' | 'images'>>
  ): Promise<VariantRow> {
    const res = await api.put<ApiResponse<VariantRow>>(
      `/variants/${variantId}`,
      data,
      { withCredentials: true }
    );
    if (!res.data?.data) throw new Error('Invalid response from updateVariant');
    return res.data.data;
  }

  /** DELETE /variants/:variantId */
  async deleteVariant(variantId: string): Promise<void> {
    await api.delete(`/variants/${variantId}`, { withCredentials: true });
  }
}

export const variantApi = new VariantApiService();
