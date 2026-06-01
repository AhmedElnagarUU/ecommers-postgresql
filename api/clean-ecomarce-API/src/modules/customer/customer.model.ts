import { Schema, model, Document } from 'mongoose';

export interface ICustomer {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerDocument extends ICustomer, Document {}

const customerSchema = new Schema<CustomerDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, select: false },
}, {
  timestamps: true
});

export const CustomerModel = model<CustomerDocument>('Customer', customerSchema);
