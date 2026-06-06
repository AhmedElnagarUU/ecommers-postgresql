'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { shippingService } from './api/shipping.api';
import {
  CreateShipmentDTO,
  CreateShippingMethodDTO,
  CreateShippingZoneDTO,
  Shipment,
  ShippingMethod,
  ShippingOrderOption,
  ShippingZone,
} from './types';
import { ShippingMethodsTable } from './components/ShippingMethodsTable';
import { ShipmentsTable } from './components/ShipmentsTable';
import { ShippingMethodForm } from './components/ShippingMethodForm';
import { ShipmentForm } from './components/ShipmentForm';
import { ShippingZonesTable } from './components/ShippingZonesTable';
import { ShippingZoneForm } from './components/ShippingZoneForm';

type ShippingTab = 'methods' | 'shipments' | 'zones';

export function ShippingPage() {
  const [activeTab, setActiveTab] = useState<ShippingTab>('methods');

  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [orders, setOrders] = useState<ShippingOrderOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showMethodForm, setShowMethodForm] = useState(false);
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    void loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [methodsData, shipmentsData, zonesData, ordersData] = await Promise.all([
        shippingService.getMethods(),
        shippingService.getShipments(),
        shippingService.getZones(),
        shippingService.getOrdersForShipment(),
      ]);
      setMethods(methodsData);
      setShipments(shipmentsData);
      setZones(zonesData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load shipping data:', err);
      error('Failed to load shipping data');
    } finally {
      setIsLoading(false);
    }
  };

  const availableOrdersForNewShipment = useMemo(() => {
    const usedOrderIds = new Set(shipments.map((shipment) => shipment.orderId));
    return orders.filter((order) => !usedOrderIds.has(order.id));
  }, [orders, shipments]);

  const openCreateMethod = () => {
    setEditingMethod(null);
    setShowMethodForm(true);
  };

  const openEditMethod = (method: ShippingMethod) => {
    setEditingMethod(method);
    setShowMethodForm(true);
  };

  const openCreateShipment = () => {
    setEditingShipment(null);
    setShowShipmentForm(true);
  };

  const openCreateZone = () => {
    setEditingZone(null);
    setShowZoneForm(true);
  };

  const openEditShipment = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setShowShipmentForm(true);
  };

  const openEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
    setShowZoneForm(true);
  };

  const handleSubmitMethod = async (payload: CreateShippingMethodDTO) => {
    setIsSaving(true);
    try {
      if (editingMethod) {
        const updated = await shippingService.updateMethod(editingMethod.id, payload);
        setMethods((prev) => prev.map((method) => (method.id === updated.id ? updated : method)));
        success('Shipping method updated');
      } else {
        const created = await shippingService.createMethod(payload);
        setMethods((prev) => [created, ...prev]);
        success('Shipping method created');
      }
      setShowMethodForm(false);
      setEditingMethod(null);
    } catch (err: any) {
      console.error('Failed to save method:', err);
      error(err?.response?.data?.message ?? 'Failed to save shipping method');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      await shippingService.deleteMethod(id);
      setMethods((prev) => prev.filter((method) => method.id !== id));
      success('Shipping method deleted');
    } catch (err: any) {
      console.error('Failed to delete method:', err);
      error(err?.response?.data?.message ?? 'Failed to delete shipping method');
    }
  };

  const handleSubmitShipment = async (payload: CreateShipmentDTO) => {
    setIsSaving(true);
    try {
      if (editingShipment) {
        const updated = await shippingService.updateShipment(editingShipment.id, payload);
        setShipments((prev) =>
          prev.map((shipment) => (shipment.id === updated.id ? updated : shipment))
        );
        success('Shipment updated');
      } else {
        const created = await shippingService.createShipment(payload);
        setShipments((prev) => [created, ...prev]);
        success('Shipment created');
      }
      setShowShipmentForm(false);
      setEditingShipment(null);
    } catch (err: any) {
      console.error('Failed to save shipment:', err);
      error(err?.response?.data?.message ?? 'Failed to save shipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    try {
      await shippingService.deleteShipment(id);
      setShipments((prev) => prev.filter((shipment) => shipment.id !== id));
      success('Shipment deleted');
    } catch (err: any) {
      console.error('Failed to delete shipment:', err);
      error(err?.response?.data?.message ?? 'Failed to delete shipment');
    }
  };

  const handleSubmitZone = async (payload: CreateShippingZoneDTO) => {
    setIsSaving(true);
    try {
      if (editingZone) {
        const updated = await shippingService.updateZone(editingZone.id, payload);
        setZones((prev) => prev.map((zone) => (zone.id === updated.id ? updated : zone)));
        success('Shipping zone updated');
      } else {
        const created = await shippingService.createZone(payload);
        setZones((prev) => [created, ...prev]);
        success('Shipping zone created');
      }
      setShowZoneForm(false);
      setEditingZone(null);
    } catch (err: any) {
      console.error('Failed to save zone:', err);
      error(err?.response?.data?.message ?? 'Failed to save shipping zone');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    try {
      await shippingService.deleteZone(id);
      setZones((prev) => prev.filter((zone) => zone.id !== id));
      success('Shipping zone deleted');
    } catch (err: any) {
      console.error('Failed to delete zone:', err);
      error(err?.response?.data?.message ?? 'Failed to delete shipping zone');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-mintlify-text">Shipping Management</h1>
          <p className="text-mintlify-text-secondary">
            Manage shipping methods and track shipments by order.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-mintlify-card/20 border border-mintlify-accent/10 w-fit">
          <button
            onClick={() => setActiveTab('methods')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'methods'
                ? 'bg-mintlify-accent text-white'
                : 'text-mintlify-text-secondary hover:text-mintlify-text'
            }`}
          >
            Methods
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'shipments'
                ? 'bg-mintlify-accent text-white'
                : 'text-mintlify-text-secondary hover:text-mintlify-text'
            }`}
          >
            Shipments
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'zones'
                ? 'bg-mintlify-accent text-white'
                : 'text-mintlify-text-secondary hover:text-mintlify-text'
            }`}
          >
            Zones
          </button>
        </div>

        <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-4 md:p-6">
          {activeTab === 'methods' ? (
            <ShippingMethodsTable
              methods={methods}
              isLoading={isLoading}
              onAdd={openCreateMethod}
              onEdit={openEditMethod}
              onDelete={handleDeleteMethod}
            />
          ) : activeTab === 'shipments' ? (
            <ShipmentsTable
              shipments={shipments}
              isLoading={isLoading}
              onAdd={openCreateShipment}
              onEdit={openEditShipment}
              onDelete={handleDeleteShipment}
            />
          ) : (
            <ShippingZonesTable
              zones={zones}
              isLoading={isLoading}
              onAdd={openCreateZone}
              onEdit={openEditZone}
              onDelete={handleDeleteZone}
            />
          )}
        </div>
      </div>

      {showMethodForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-mintlify-card/25 border border-mintlify-accent/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-mintlify-text mb-4">
              {editingMethod ? 'Edit Shipping Method' : 'Create Shipping Method'}
            </h2>
            <ShippingMethodForm
              initialData={editingMethod ?? undefined}
              onSubmit={handleSubmitMethod}
              onCancel={() => {
                setShowMethodForm(false);
                setEditingMethod(null);
              }}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {showShipmentForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-mintlify-card/25 border border-mintlify-accent/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-mintlify-text mb-4">
              {editingShipment ? 'Edit Shipment' : 'Create Shipment'}
            </h2>
            <ShipmentForm
              initialData={editingShipment ?? undefined}
              methods={methods}
              orders={editingShipment ? orders : availableOrdersForNewShipment}
              onSubmit={handleSubmitShipment}
              onCancel={() => {
                setShowShipmentForm(false);
                setEditingShipment(null);
              }}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}

      {showZoneForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-mintlify-card/25 border border-mintlify-accent/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-mintlify-text mb-4">
              {editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
            </h2>
            <ShippingZoneForm
              initialData={editingZone ?? undefined}
              onSubmit={handleSubmitZone}
              onCancel={() => {
                setShowZoneForm(false);
                setEditingZone(null);
              }}
              isLoading={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
}
