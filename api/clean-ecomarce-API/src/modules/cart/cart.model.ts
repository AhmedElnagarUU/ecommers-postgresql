import { model, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariants: { type: Map, of: String },
  }],
  totalPrice: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

export const CartModel = model<ICart>('Cart', cartSchema);
