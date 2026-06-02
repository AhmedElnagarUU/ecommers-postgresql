export type PaymentTxStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE';

export interface IPayment {
  id: string;
  customerId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentTxStatus;
  method: PaymentMethod;
  transactionId?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
