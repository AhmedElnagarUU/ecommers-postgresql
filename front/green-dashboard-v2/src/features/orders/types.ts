export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  product: {
    _id: string;
    id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  _id: string;
  id: string;
  orderNumber: string;
  customer: {
    _id: string;
    id: string;
    name: string;
    email: string;
  };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
