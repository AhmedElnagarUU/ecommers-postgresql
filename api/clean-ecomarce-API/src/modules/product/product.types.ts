import { IVariantCombination, IVariantGroup } from './product.model';

/**
 * Product as returned by the API after formatting.
 * - category is the category name string (from the relation include)
 * - imageUrls are ready-to-use HTTPS signed URLs resolved from S3 keys
 */
export interface ProductWithUrls {
  id: string;
  name: string;
  description?: string | null;
  slug: string;
  price: number;
  stock: number;
  category?: string | null;
  images: string[];
  imageUrls: string[];
  status: 'ACTIVE' | 'INACTIVE';
  hasVariants: boolean;
  variantGroups: IVariantGroup[];
  useVariantStock: boolean;
  useVariantPricing: boolean;
  variantCombinations: IVariantCombination[];
  createdAt?: Date;
  updatedAt?: Date;
}
