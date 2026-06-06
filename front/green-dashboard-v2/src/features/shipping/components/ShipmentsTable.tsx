'use client';

import { useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';
import { Shipment, ShipmentStatus } from '../types';

interface ShipmentsTableProps {
  shipments: Shipment[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => Promise<void>;
}

function statusClass(status: ShipmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-400';
    case 'SHIPPED':
      return 'bg-blue-500/10 text-blue-400';
    case 'IN_TRANSIT':
      return 'bg-purple-500/10 text-purple-400';
    case 'DELIVERED':
      return 'bg-green-500/10 text-green-400';
    case 'CANCELLED':
      return 'bg-red-500/10 text-red-400';
    default:
      return 'bg-mintlify-hover/30 text-mintlify-text-secondary';
  }
}

export function ShipmentsTable({
  shipments,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: ShipmentsTableProps) {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Shipment | null>(null);

  const filteredShipments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return shipments;
    return shipments.filter((shipment) => {
      const orderNumber = shipment.order?.orderNumber ?? '';
      const customerName = shipment.order?.customer?.name ?? '';
      return (
        orderNumber.toLowerCase().includes(term) ||
        customerName.toLowerCase().includes(term) ||
        (shipment.trackingNumber ?? '').toLowerCase().includes(term) ||
        (shipment.carrier ?? '').toLowerCase().includes(term)
      );
    });
  }, [shipments, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-24 rounded-lg bg-mintlify-hover/30 animate-pulse" />
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
            placeholder="Search shipments..."
            className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center px-4 py-2 bg-mintlify-accent text-white rounded-lg hover:bg-mintlify-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Shipment
        </button>
      </div>

      <div className="space-y-3">
        {filteredShipments.map((shipment) => (
          <div
            key={shipment.id}
            className="bg-mintlify-card/20 backdrop-blur-xl border border-mintlify-accent/10 rounded-lg p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-mintlify-text font-medium">Order #{shipment.order.orderNumber}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusClass(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                <p className="text-sm text-mintlify-text-secondary">
                  Customer: {shipment.order.customer.name}
                </p>
                <p className="text-sm text-mintlify-text-secondary">
                  Carrier: {shipment.carrier || '-'} • Tracking: {shipment.trackingNumber || '-'}
                </p>
                <p className="text-sm text-mintlify-text-secondary">
                  Method: {shipment.shippingMethod?.name || 'No method'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(shipment)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-mintlify-accent hover:bg-mintlify-accent/10"
                  title="Edit shipment"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(shipment)}
                  className="p-2 rounded-lg text-mintlify-text-secondary hover:text-red-400 hover:bg-red-500/10"
                  title="Delete shipment"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredShipments.length === 0 && (
          <div className="text-center py-8 text-mintlify-text-secondary">No shipments found</div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete shipment"
        message={`Delete shipment for order #${deleteTarget?.order.orderNumber}?`}
        confirmText="Delete"
      />
    </div>
  );
}
