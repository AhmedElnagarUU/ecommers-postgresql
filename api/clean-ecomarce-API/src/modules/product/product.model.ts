export interface IVariantGroup {
  name: string;
  options: string[];
}

export interface IVariantCombination {
  selections: Record<string, string>;
  stock?: number;
  price?: number;
}

export interface IProduct {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
  hasVariants: boolean;
  useVariantStock: boolean;
  useVariantPricing: boolean;
  createdAt: Date;
  updatedAt: Date;
}
