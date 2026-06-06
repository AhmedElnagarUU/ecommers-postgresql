'use client';

import { useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import { ShippingMethod } from '../types';

interface ShippingMethodsTableProps {
  methods: ShippingMethod[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (method: ShippingMethod) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ShippingMethodsTable({
  methods,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: ShippingMethodsTableProps) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ShippingMethod | null>(null);

  const filteredMethods = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return methods;
    return methods.filter((method) => {
      return (
        method.name.toLowerCase().includes(term) ||
        (method.description ?? '').toLowerCase().includes(term)
      );
    });
  }, [methods, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-16 rounded-lg bg-mintlify-hover/30 animate-pulse" />
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
            placeholder="Search shipping methods..."
            className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center px-4 py-2 bg-mintlify-accent text-white rounded-lg hover:bg-mintlify-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Method
        </button>
      </div>

      <div className="space-y-3">
        {filteredMethods.map((method) => (
          <div
            key={method.id}
            className="bg-mintlify-card/20 backdrop-blur-xl border border-mintlify-accent/10 rounded-lg p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-mintlify-text font-medium">{method.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      method.isActive
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-mintlify-hover/40 text-mintlify-text-secondary'
                    }`}
                  >
                    {method.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-mintlify-text-secondary">
                  {method.description || 'No description'}
                </p>
                <p className="text-sm text-mintlify-text-secondary">
                  ${method.price.toFixed(2)}
                  {method.estimatedDaysMin || method.estimatedDaysMax
                    ? ` • ETA ${method.estimatedDaysMin ?? '?'}-${method.estimatedDaysMax ?? '?'} days`
                    : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(method)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-mintlify-accent hover:bg-mintlify-accent/10"
                  title="Edit method"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(method)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-red-400 hover:bg-red-500/10"
                  title="Delete method"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMethods.length === 0 && (
          <div className="text-center py-8 text-mintlify-text-secondary">No shipping methods found</div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete shipping method"
        message={`Delete "${deleteTarget?.name}"? Existing shipment records will keep only historical values.`}
        confirmText="Delete"
      />
    </div>
  );
}
