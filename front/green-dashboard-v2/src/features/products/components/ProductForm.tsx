'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { productService } from '../api/product.api';
import type { CreateProductDTO, Product } from '../types';
import { Loader2, Upload, X } from 'lucide-react';
import { Select } from '@/shared/ui/Select';
import { ProductImage } from './ProductImage';
import { getDisplayableImageUrls } from '@/shared/lib/product-image';
import { categoryService } from '@/features/categories/api/category.api';
import { ProductVariantsEditor } from './ProductVariantsEditor';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateProductDTO>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || '',
    status: initialData?.status || 'active',
    hasVariants: initialData?.hasVariants || false,
    variantGroups: initialData?.variantGroups || [],
    useVariantStock: initialData?.useVariantStock || false,
    useVariantPricing: initialData?.useVariantPricing || false,
    variantCombinations: initialData?.variantCombinations || [],
  });

  const [imagePreviews, setImagePreviews] = useState<{ file: File | null; preview: string }[]>(
    () =>
      getDisplayableImageUrls(
        Array.isArray(initialData?.imageUrls) ? (initialData.imageUrls as string[]) : undefined,
        Array.isArray(initialData?.images) ? (initialData.images as string[]) : undefined
      ).map((url) => ({
        file: null,
        preview: url,
      }))
  );
  const { error } = useToast();

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getCategories();
        const categoryNames = fetchedCategories.map(cat => cat.name);
        setCategories(categoryNames);
        if (!initialData?.category && categoryNames.length > 0) {
          setFormData(prev => ({ ...prev, category: categoryNames[0] }));
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        error('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalImages = imagePreviews.length + files.length;

    if (totalImages > 5) {
      error('Maximum 5 images allowed');
      return;
    }

    if (totalSize > 10 * 1024 * 1024) { // 10MB total limit
      error('Total image size should be less than 10MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      error('Please upload valid image files (JPEG, PNG, or WebP)');
      return;
    }

    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...files] }));
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-mintlify-text">
          Product Images
        </label>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-32 h-32">
                <div className="relative w-full h-full rounded-lg bg-mintlify-hover/30 overflow-hidden">
                  <ProductImage
                    src={preview.preview}
                    alt={`Product preview ${index + 1}`}
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <div className="relative w-32 h-32 rounded-lg bg-mintlify-hover/30 overflow-hidden">
                <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <Upload className="w-8 h-8 text-mintlify-text-secondary" />
                </label>
              </div>
            )}
          </div>
          <p className="text-xs text-mintlify-text-secondary">
            Upload up to 5 images. Supported formats: JPEG, PNG, WebP. Max total size: 10MB
          </p>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <Select
            name="category"
            label="Category"
            value={formData.category}
            onChange={handleChange}
            required
            options={[
              { value: '', label: 'Select a category' },
              ...categories.map(category => ({
                value: category,
                label: category
              }))
            ]}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        {!(formData.hasVariants && formData.useVariantStock) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-mintlify-text">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required={!formData.hasVariants || !formData.useVariantStock}
              min="0"
              className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            />
          </div>
        )}

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="md:col-span-2">
          <ProductVariantsEditor
            hasVariants={!!formData.hasVariants}
            variantGroups={formData.variantGroups || []}
            variantCombinations={formData.variantCombinations || []}
            useVariantStock={!!formData.useVariantStock}
            useVariantPricing={!!formData.useVariantPricing}
            onChange={(variantData) => setFormData((prev) => ({ ...prev, ...variantData }))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mintlify-text-secondary hover:text-mintlify-text 
            bg-mintlify-hover/30 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="relative px-4 py-2 bg-mintlify-accent hover:bg-mintlify-accent-dark 
            text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin absolute left-2 top-1/2 transform -translate-y-1/2" />
          )}
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
} 