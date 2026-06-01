import mongoose, { Document } from 'mongoose';

export type OrderItem = {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
};

export interface IOrder {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDocument extends IOrder, Document {}

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    selectedVariants: {
      type: Map,
      of: String,
      default: undefined
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  }
}, {
  timestamps: true
});

/** Runs before required-field validation so orderNumber exists on OrderModel.create() */
orderSchema.pre('validate', async function () {
  if (!this.isNew || this.orderNumber) return;

  const Order = this.constructor as mongoose.Model<OrderDocument>;
  const count = await Order.countDocuments();
  this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
});

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);

export async function generateOrderNumber(): Promise<string> {
  const count = await OrderModel.countDocuments();
  return `ORD${String(count + 1).padStart(6, '0')}`;
}
