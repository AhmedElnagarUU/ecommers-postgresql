'use client';

import React, { useState } from 'react';
import { Edit, Trash, Search, Plus, Crosshair } from 'lucide-react';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import type { Pixel } from '../types';
import { PIXEL_PLATFORM_LABELS } from '../types';

interface PixelListProps {
  pixels: Pixel[];
  onEdit: (pixel: Pixel) => void;
  onDelete: (pixelId: string) => void;
  onToggle: (pixel: Pixel) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export function PixelList({
  pixels,
  onEdit,
  onDelete,
  onToggle,
  onAdd,
  isLoading,
}: PixelListProps) {
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pixelToDelete, setPixelToDelete] = useState<Pixel | null>(null);

  const filteredPixels = pixels.filter(
    (pixel) =>
      pixel.label.toLowerCase().includes(search.toLowerCase()) ||
      pixel.pixelId.toLowerCase().includes(search.toLowerCase()) ||
      PIXEL_PLATFORM_LABELS[pixel.platform].toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (pixel: Pixel) => {
    setPixelToDelete(pixel);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pixelToDelete) {
      onDelete(pixelToDelete.id);
      setDeleteModalOpen(false);
      setPixelToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-mintlify-hover/30 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mintlify-text-secondary" />
          <input
            type="text"
            placeholder="Search pixels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-mintlify-accent hover:bg-mintlify-accent-dark 
            text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pixel
        </button>
      </div>

      <div className="grid gap-4">
        {filteredPixels.map((pixel) => (
          <div
            key={pixel.id}
            className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-4 
              border border-mintlify-accent/10 hover:border-mintlify-accent/20
              transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-mintlify-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-mintlify-text">{pixel.label}</h3>
                <p className="text-sm text-mintlify-text-secondary">
                  {PIXEL_PLATFORM_LABELS[pixel.platform]} · {pixel.pixelId}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      pixel.enabled
                        ? 'bg-mintlify-accent/10 text-mintlify-accent'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {pixel.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {pixel.platform === 'meta' && pixel.accessToken && (
                    <span className="text-xs px-2 py-1 rounded-full bg-mintlify-hover/30 text-mintlify-text-secondary">
                      CAPI configured
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onToggle(pixel)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pixel.enabled ? 'bg-mintlify-accent' : 'bg-mintlify-accent/10'
                  }`}
                  aria-label={pixel.enabled ? 'Disable pixel' : 'Enable pixel'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      pixel.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  onClick={() => onEdit(pixel)}
                  className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                    hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(pixel)}
                  className="p-2 text-mintlify-text-secondary hover:text-red-400 
                    hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPixels.length === 0 && (
          <div className="text-center py-8">
            <p className="text-mintlify-text-secondary">No tracking pixels configured</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pixel"
        message={`Are you sure you want to delete "${pixelToDelete?.label}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
