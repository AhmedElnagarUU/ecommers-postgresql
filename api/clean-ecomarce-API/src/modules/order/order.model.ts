export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  variants: Array<{ groupName: string; value: string }>;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateOrderNumber(count: number): Promise<string> {
  return `ORD${String(count + 1).padStart(6, '0')}`;
}
