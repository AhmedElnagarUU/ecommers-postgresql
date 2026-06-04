'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PixelList } from '@/features/pixels/components/PixelList';
import { PixelForm } from '@/features/pixels/components/PixelForm';
import { pixelService } from '@/features/pixels/api/pixel.api';
import type { CreatePixelDTO, Pixel } from '@/features/pixels/types';
import { useToast } from '@/shared/hooks/useToast';

export default function PixelsSettingsPage() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPixel, setEditingPixel] = useState<Pixel | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadPixels();
  }, []);

  const loadPixels = async () => {
    try {
      const data = await pixelService.getPixels();
      setPixels(data);
    } catch (err) {
      console.error('Error loading pixels:', err);
      error('Failed to load tracking pixels');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPixel(null);
    setShowForm(true);
  };

  const handleEdit = (pixel: Pixel) => {
    setEditingPixel(pixel);
    setShowForm(true);
  };

  const handleDelete = async (pixelId: string) => {
    try {
      await pixelService.deletePixel(pixelId);
      setPixels(pixels.filter((p) => p.id !== pixelId));
      success('Pixel deleted successfully');
    } catch (err) {
      console.error('Error deleting pixel:', err);
      error('Failed to delete pixel');
    }
  };

  const handleToggle = async (pixel: Pixel) => {
    try {
      const updated = await pixelService.updatePixel(pixel.id, { enabled: !pixel.enabled });
      setPixels(pixels.map((p) => (p.id === pixel.id ? updated : p)));
      success(updated.enabled ? 'Pixel enabled' : 'Pixel disabled');
    } catch (err) {
      console.error('Error toggling pixel:', err);
      error('Failed to update pixel');
    }
  };

  const handleSubmit = async (data: CreatePixelDTO) => {
    setFormLoading(true);
    try {
      if (editingPixel) {
        const updated = await pixelService.updatePixel(editingPixel.id, data);
        setPixels(pixels.map((p) => (p.id === editingPixel.id ? updated : p)));
        success('Pixel updated successfully');
      } else {
        const created = await pixelService.createPixel(data);
        setPixels([created, ...pixels]);
        success('Pixel added successfully');
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving pixel:', err);
      error('Failed to save pixel');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center text-sm text-mintlify-text-secondary hover:text-mintlify-accent mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Settings
          </Link>
          <h1 className="text-2xl font-bold text-mintlify-text">Pixels & Tracking</h1>
          <p className="text-mintlify-text-secondary">
            Manage tracking pixels and conversion APIs for your storefront
          </p>
        </div>

        {showForm ? (
          <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
            <h2 className="text-lg font-semibold text-mintlify-text mb-6">
              {editingPixel ? 'Edit Pixel' : 'Add Pixel'}
            </h2>
            <PixelForm
              initialData={editingPixel || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={formLoading}
            />
          </div>
        ) : (
          <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
            <PixelList
              pixels={pixels}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onAdd={handleAdd}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
