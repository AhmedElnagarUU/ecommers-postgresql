import { Schema, model, Document } from 'mongoose';
import slugify from 'slugify';

export interface IVariantGroup {
  name: string;
  options: string[];
}

export interface IVariantCombination {
  selections: Record<string, string>;
  stock?: number;
  price?: number;
}

export interface IProduct extends Document {
  name?: string;
  description?: string;
  slug?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  status?: 'active' | 'inactive';
  hasVariants?: boolean;
  variantGroups?: IVariantGroup[];
  useVariantStock?: boolean;
  useVariantPricing?: boolean;
  variantCombinations?: IVariantCombination[];
  createdAt?: Date;
  updatedAt?: Date;
}

const variantGroupSchema = new Schema<IVariantGroup>(
  {
    name: { type: String, required: true, trim: true },
    options: [{ type: String, trim: true }],
  },
  { _id: false }
);

const variantCombinationSchema = new Schema<IVariantCombination>(
  {
    selections: { type: Map, of: String, required: true },
    stock: { type: Number, min: 0 },
    price: { type: Number, min: 0 },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: false,
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: false,
      min: [0, 'Stock cannot be negative'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variantGroups: {
      type: [variantGroupSchema],
      default: undefined,
    },
    useVariantStock: {
      type: Boolean,
      default: false,
    },
    useVariantPricing: {
      type: Boolean,
      default: false,
    },
    variantCombinations: {
      type: [variantCombinationSchema],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name ?? '', { lower: true });
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema);
