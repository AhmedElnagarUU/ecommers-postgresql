export type ShipmentStatus = 'PENDING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  estimatedDaysMin?: number | null;
  estimatedDaysMax?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Shipment {
  id: string;
  orderId: string;
  shippingMethodId?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  status: ShipmentStatus;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  order: ShipmentOrderSummary;
  shippingMethod?: ShippingMethod | null;
}

export interface ShippingOrderOption {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
}

export interface CreateShippingMethodDTO {
  name: string;
  description?: string;
  price: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  isActive?: boolean;
}

export interface UpdateShippingMethodDTO extends Partial<CreateShippingMethodDTO> {}

export interface CreateShipmentDTO {
  orderId: string;
  shippingMethodId?: string;
  carrier?: string;
  trackingNumber?: string;
  status?: ShipmentStatus;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface UpdateShipmentDTO extends Partial<CreateShipmentDTO> {}

export interface ShippingZoneLocation {
  id: string;
  zoneId: string;
  country: string;
  city: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  locations: ShippingZoneLocation[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZoneLocationInput {
  country: string;
  city: string;
}

export interface CreateShippingZoneDTO {
  name: string;
  price: number;
  isActive?: boolean;
  locations: ShippingZoneLocationInput[];
}

export interface UpdateShippingZoneDTO extends Partial<CreateShippingZoneDTO> {}
