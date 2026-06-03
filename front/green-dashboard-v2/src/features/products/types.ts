export interface VariantGroup {
  name: string;
  options: string[];
}

export interface VariantCombination {
  selections: Record<string, string>;
  stock?: number;
  price?: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  imageUrls: unknown;
  status: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: VariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: VariantCombination[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: File[];
  status?: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: VariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: VariantCombination[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  _id: string;
}
