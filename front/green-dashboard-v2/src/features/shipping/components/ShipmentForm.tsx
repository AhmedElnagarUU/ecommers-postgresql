'use client';

import { useMemo, useState } from 'react';
import {
  CreateShipmentDTO,
  Shipment,
  ShipmentStatus,
  ShippingMethod,
  ShippingOrderOption,
} from '../types';

interface ShipmentFormProps {
  initialData?: Shipment;
  methods: ShippingMethod[];
  orders: ShippingOrderOption[];
  onSubmit: (payload: CreateShipmentDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions: ShipmentStatus[] = ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

export function ShipmentForm({
  initialData,
  methods,
  orders,
  onSubmit,
  onCancel,
  isLoading,
}: ShipmentFormProps) {
  const [formData, setFormData] = useState<CreateShipmentDTO>({
    orderId: initialData?.orderId ?? '',
    shippingMethodId: initialData?.shippingMethodId ?? '',
    carrier: initialData?.carrier ?? '',
    trackingNumber: initialData?.trackingNumber ?? '',
    status: initialData?.status ?? 'PENDING',
    shippedAt: initialData?.shippedAt ? initialData.shippedAt.slice(0, 16) : '',
    deliveredAt: initialData?.deliveredAt ? initialData.deliveredAt.slice(0, 16) : '',
    notes: initialData?.notes ?? '',
  });

  const availableOrders = useMemo(() => {
    if (initialData) return orders;
    return orders;
  }, [orders, initialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      shippingMethodId: formData.shippingMethodId || undefined,
      carrier: formData.carrier?.trim() || undefined,
      trackingNumber: formData.trackingNumber?.trim() || undefined,
      shippedAt: formData.shippedAt || undefined,
      deliveredAt: formData.deliveredAt || undefined,
      notes: formData.notes?.trim() || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Order</label>
          <select
            required
            value={formData.orderId}
            onChange={(e) => setFormData((prev) => ({ ...prev, orderId: e.target.value }))}
            disabled={!!initialData}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50 disabled:opacity-60"
          >
            <option value="">Select an order</option>
            {availableOrders.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.orderNumber} - {order.customerName} (${order.totalAmount.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Shipping method</label>
          <select
            value={formData.shippingMethodId}
            onChange={(e) => setFormData((prev) => ({ ...prev, shippingMethodId: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            <option value="">No method</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name} (${method.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Carrier</label>
          <input
            type="text"
            value={formData.carrier ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, carrier: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Tracking number</label>
          <input
            type="text"
            value={formData.trackingNumber ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, trackingNumber: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value as ShipmentStatus }))
            }
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-mintlify-text">Shipped at</label>
          <input
            type="datetime-local"
            value={formData.shippedAt ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, shippedAt: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-mintlify-text">Delivered at</label>
          <input
            type="datetime-local"
            value={formData.deliveredAt ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, deliveredAt: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-mintlify-text">Notes</label>
          <textarea
            rows={3}
            value={formData.notes ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
          />
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
          {isLoading ? 'Saving...' : initialData ? 'Update Shipment' : 'Create Shipment'}
        </button>
      </div>
    </form>
  );
}
