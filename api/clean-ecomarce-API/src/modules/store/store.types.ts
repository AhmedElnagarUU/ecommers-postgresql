/** Cart line returned to the storefront client */
export interface StoreCartItem {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  imageUrls: string[];
}

export interface StoreCart {
  _id: string;
  items: StoreCartItem[];
  totalPrice: number;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
