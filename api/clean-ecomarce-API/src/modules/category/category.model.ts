import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface ICategory {
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

export const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema);
export const Category = CategoryModel;
