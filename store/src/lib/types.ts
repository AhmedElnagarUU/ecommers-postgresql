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
  imageUrls?: string[];
  hasVariants?: boolean;
  variantGroups?: VariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: VariantCombination[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  imageUrls?: string[];
}

export interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  id: string;
  label?: string | null;
  recipientName?: string | null;
  phone: string;
  street: string;
  city: string;
  state?: string | null;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  items: Array<{
    product: { name: string } | string;
    quantity: number;
    price: number;
    selectedVariants?: Record<string, string>;
  }>;
  shippingAddress: Record<string, string>;
  createdAt: string;
}
