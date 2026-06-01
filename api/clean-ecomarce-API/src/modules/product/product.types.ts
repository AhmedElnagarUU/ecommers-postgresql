import { IVariantCombination, IVariantGroup } from './product.model';

/**
 * Product as returned by the API after formatting (not a Mongoose document).
 * - category is the category name string (after populate + format)
 * - imageUrls are ready-to-use HTTPS signed URLs (or keys resolved to URLs)
 */
export interface ProductWithUrls {
  _id: string;
  name?: string;
  description?: string;
  slug?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  imageUrls: string[];
  status?: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: IVariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: IVariantCombination[];
  createdAt?: Date;
  updatedAt?: Date;
}
