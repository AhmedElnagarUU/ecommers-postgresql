export interface StoreCartItem {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string>;
  imageUrls: string[];
}

export interface StoreCart {
  id: string;
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

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface CustomerAddressDto {
  label?: string;
  recipientName?: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}
