export interface ICartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  variants: Array<{ groupName: string; value: string }>;
}

export interface ICart {
  id: string;
  customerId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
