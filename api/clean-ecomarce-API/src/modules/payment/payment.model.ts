import { model, Schema, Types } from 'mongoose';

export interface IPayment {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'paypal' | 'stripe';
  transactionId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  method: { 
    type: String, 
    enum: ['credit_card', 'paypal', 'stripe'], 
    required: true 
  },
  transactionId: { type: String },
  errorMessage: { type: String },
}, {
  timestamps: true
});

export const PaymentModel = model<IPayment>('Payment', paymentSchema);
