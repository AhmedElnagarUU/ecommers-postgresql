'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { CreatePixelDTO, Pixel, PixelPlatform } from '../types';
import { PIXEL_ID_PLACEHOLDERS, PIXEL_PLATFORM_LABELS } from '../types';

interface PixelFormProps {
  initialData?: Pixel;
  onSubmit: (data: CreatePixelDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PLATFORMS = Object.keys(PIXEL_PLATFORM_LABELS) as PixelPlatform[];

export function PixelForm({ initialData, onSubmit, onCancel, isLoading }: PixelFormProps) {
  const [formData, setFormData] = useState<CreatePixelDTO>({
    platform: initialData?.platform || 'meta',
    label: initialData?.label || '',
    pixelId: initialData?.pixelId || '',
    enabled: initialData?.enabled ?? true,
    accessToken: initialData?.accessToken || '',
    testEventCode: initialData?.testEventCode || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const payload: CreatePixelDTO = {
      platform: formData.platform,
      label: formData.label,
      pixelId: formData.pixelId,
      enabled: formData.enabled,
    };

    if (formData.platform === 'meta') {
      if (formData.accessToken?.trim()) {
        payload.accessToken = formData.accessToken.trim();
      }
      if (formData.testEventCode?.trim()) {
        payload.testEventCode = formData.testEventCode.trim();
      }
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            disabled={!!initialData}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50 disabled:opacity-60"
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {PIXEL_PLATFORM_LABELS[platform]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            placeholder="e.g. Main Meta Pixel"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">
            {formData.platform === 'google_ga4' ? 'Measurement ID' : 'Pixel / Container ID'}
          </label>
          <input
            type="text"
            name="pixelId"
            value={formData.pixelId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            placeholder={PIXEL_ID_PLACEHOLDERS[formData.platform]}
          />
        </div>

        {formData.platform === 'meta' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-mintlify-text">
                Conversions API Access Token (optional)
              </label>
              <input
                type="password"
                name="accessToken"
                value={formData.accessToken || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
                placeholder="Server-side access token"
              />
              <p className="text-xs text-mintlify-text-secondary">
                Used for server-side Purchase events. Never exposed to the storefront.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-mintlify-text">
                Test Event Code (optional)
              </label>
              <input
                type="text"
                name="testEventCode"
                value={formData.testEventCode || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
                placeholder="TEST12345"
              />
            </div>
          </>
        )}
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
