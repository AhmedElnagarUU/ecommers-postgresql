'use client';

import { useState } from 'react';
import { ShippingMethod, CreateShippingMethodDTO } from '../types';

interface ShippingMethodFormProps {
  initialData?: ShippingMethod;
  onSubmit: (payload: CreateShippingMethodDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ShippingMethodForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ShippingMethodFormProps) {
  const [formData, setFormData] = useState<CreateShippingMethodDTO>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? 0,
    estimatedDaysMin: initialData?.estimatedDaysMin ?? undefined,
    estimatedDaysMax: initialData?.estimatedDaysMax ?? undefined,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      estimatedDaysMin: formData.estimatedDaysMin || undefined,
      estimatedDaysMax: formData.estimatedDaysMax || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Min delivery days</label>
          <input
            type="number"
            min="0"
            value={formData.estimatedDaysMin ?? ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedDaysMin: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Max delivery days</label>
          <input
            type="number"
            min="0"
            value={formData.estimatedDaysMax ?? ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedDaysMax: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Description</label>
          <textarea
            rows={3}
            value={formData.description ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm text-mintlify-text-secondary">
            <input
              type="checkbox"
              checked={!!formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Active method
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-mintlify-hover/30 text-mintlify-text-secondary rounded-lg hover:text-mintlify-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-mintlify-accent text-white rounded-lg hover:bg-mintlify-accent-dark disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Method' : 'Create Method'}
        </button>
      </div>
    </form>
  );
}
