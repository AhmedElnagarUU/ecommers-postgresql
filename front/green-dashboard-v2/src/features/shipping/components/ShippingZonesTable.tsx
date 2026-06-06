'use client';

import { useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import { ShippingZone } from '../types';

interface ShippingZonesTableProps {
  zones: ShippingZone[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (zone: ShippingZone) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ShippingZonesTable({
  zones,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: ShippingZonesTableProps) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ShippingZone | null>(null);

  const filteredZones = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return zones;
    return zones.filter((zone) => {
      const locationText = zone.locations
        .map((location) => `${location.country} ${location.city}`)
        .join(' ')
        .toLowerCase();
      return zone.name.toLowerCase().includes(term) || locationText.includes(term);
    });
  }, [zones, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-20 rounded-lg bg-mintlify-hover/30 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mintlify-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search zones..."
            className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center px-4 py-2 bg-mintlify-accent text-white rounded-lg hover:bg-mintlify-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </button>
      </div>

      <div className="space-y-3">
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            className="bg-mintlify-card/20 backdrop-blur-xl border border-mintlify-accent/10 rounded-lg p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-mintlify-text font-medium">{zone.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      zone.isActive
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-mintlify-hover/40 text-mintlify-text-secondary'
                    }`}
                  >
                    {zone.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-mintlify-text-secondary">
                  ${zone.price.toFixed(2)} • {zone.locations.length} location
                  {zone.locations.length === 1 ? '' : 's'}
                </p>
                <p className="text-sm text-mintlify-text-secondary">
                  {zone.locations
                    .slice(0, 3)
                    .map((loc) => `${loc.city}, ${loc.country}`)
                    .join(' • ') || 'No locations'}
                  {zone.locations.length > 3 ? ` +${zone.locations.length - 3} more` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(zone)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-mintlify-accent hover:bg-mintlify-accent/10"
                  title="Edit zone"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(zone)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-red-400 hover:bg-red-500/10"
                  title="Delete zone"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredZones.length === 0 && (
          <div className="text-center py-8 text-mintlify-text-secondary">No shipping zones found</div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete shipping zone"
        message={`Delete zone "${deleteTarget?.name}"? This will remove all attached locations.`}
        confirmText="Delete"
      />
    </div>
  );
}
