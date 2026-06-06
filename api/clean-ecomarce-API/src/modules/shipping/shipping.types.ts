export type ShipmentStatus = 'PENDING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface CreateShippingMethodDto {
  name: string;
  description?: string;
  price: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  isActive?: boolean;
}

export interface UpdateShippingMethodDto extends Partial<CreateShippingMethodDto> {}

export interface CreateShipmentDto {
  orderId: string;
  shippingMethodId?: string;
  carrier?: string;
  trackingNumber?: string;
  status?: ShipmentStatus;
  shippedAt?: string | Date;
  deliveredAt?: string | Date;
  notes?: string;
}

export interface UpdateShipmentDto extends Partial<CreateShipmentDto> {}

export interface ShippingZoneLocationInput {
  country: string;
  city: string;
}

export interface CreateShippingZoneDto {
  name: string;
  price: number;
  isActive?: boolean;
  locations: ShippingZoneLocationInput[];
}

export interface UpdateShippingZoneDto extends Partial<CreateShippingZoneDto> {}
