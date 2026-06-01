'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Category, CreateCategoryDTO } from '@/api/category.service';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CreateCategoryDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ initialData, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryDTO>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active'
  });

  const { error } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            placeholder="Enter category name"
          />
        </div>

        <div className="space-y-2">
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
            placeholder="Enter category description"
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text-secondary rounded-lg
            hover:bg-mintlify-hover/50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="relative px-4 py-2 bg-mintlify-accent hover:bg-mintlify-accent-dark
            text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Save</span>
              <Loader2 className="w-5 h-5 animate-spin absolute inset-0 m-auto" />
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  );
} 