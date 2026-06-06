import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import {
  CreateShipmentDto,
  CreateShippingMethodDto,
  CreateShippingZoneDto,
  ShipmentStatus,
  ShippingZoneLocationInput,
  UpdateShipmentDto,
  UpdateShippingMethodDto,
  UpdateShippingZoneDto,
  WorldLocationCountry,
} from './shipping.types';

const SHIPMENT_INCLUDE = {
  order: {
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  shippingMethod: true,
} as const;

const ZONE_INCLUDE = {
  locations: {
    orderBy: [{ country: 'asc' as const }, { city: 'asc' as const }],
  },
};

const WORLD_LOCATIONS_URL =
  process.env.WORLD_LOCATIONS_API_URL || 'https://countriesnow.space/api/v0.1/countries';
const WORLD_LOCATIONS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let worldLocationsCache: { expiresAt: number; data: WorldLocationCountry[] } | null = null;

function toValidDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, 'Invalid date value');
  }
  return parsed;
}

function validateStatus(status?: string): status is ShipmentStatus {
  return ['PENDING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status ?? '');
}

function normalizeZoneLocations(locations: ShippingZoneLocationInput[] = []) {
  return locations
    .map((location) => ({
      country: (location.country ?? '').trim(),
      city: (location.city ?? '').trim(),
    }))
    .filter((location) => location.country && location.city);
}

function filterBySearch(values: string[], search?: string, limit = 250) {
  const normalizedSearch = (search ?? '').trim().toLowerCase();
  const filtered = normalizedSearch
    ? values.filter((value) => value.toLowerCase().includes(normalizedSearch))
    : values;
  return filtered.slice(0, Math.max(1, Math.min(limit, 1000)));
}

export class ShippingService {
  private async fetchWorldLocations(): Promise<WorldLocationCountry[]> {
    if (worldLocationsCache && worldLocationsCache.expiresAt > Date.now()) {
      return worldLocationsCache.data;
    }

    const response = await fetch(WORLD_LOCATIONS_URL);
    if (!response.ok) {
      throw new ApiError(502, 'Unable to load world locations');
    }

    const payload = (await response.json()) as {
      error?: boolean;
      data?: Array<{ country?: string; cities?: unknown }>;
    };

    if (payload.error || !Array.isArray(payload.data)) {
      throw new ApiError(502, 'World locations API returned an invalid response');
    }

    const data = payload.data
      .map((item) => ({
        country: String(item.country ?? '').trim(),
        cities: Array.isArray(item.cities)
          ? item.cities
              .map((city) => String(city ?? '').trim())
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b))
          : [],
      }))
      .filter((item) => item.country)
      .sort((a, b) => a.country.localeCompare(b.country));

    worldLocationsCache = {
      expiresAt: Date.now() + WORLD_LOCATIONS_CACHE_TTL_MS,
      data,
    };

    return data;
  }

  async getWorldLocations() {
    return this.fetchWorldLocations();
  }

  async getWorldCountries(search?: string, limit?: number) {
    const locations = await this.fetchWorldLocations();
    return filterBySearch(
      locations.map((location) => location.country),
      search,
      limit
    );
  }

  async getWorldCities(country: string, search?: string, limit?: number) {
    const normalizedCountry = (country ?? '').trim();
    if (!normalizedCountry) throw new ApiError(400, 'country is required');

    const locations = await this.fetchWorldLocations();
    const location = locations.find(
      (item) => item.country.toLowerCase() === normalizedCountry.toLowerCase()
    );
    if (!location) throw new ApiError(404, 'Country not found');

    return filterBySearch(location.cities, search, limit);
  }

  async getZones() {
    return prisma.shippingZone.findMany({
      include: ZONE_INCLUDE,
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getZoneById(id: string) {
    const zone = await prisma.shippingZone.findUnique({
      where: { id },
      include: ZONE_INCLUDE,
    });
    if (!zone) throw new ApiError(404, 'Shipping zone not found');
    return zone;
  }

  async createZone(dto: CreateShippingZoneDto) {
    if (!dto.name?.trim()) throw new ApiError(400, 'Zone name is required');
    if (dto.price == null || Number(dto.price) < 0) throw new ApiError(400, 'Zone price must be 0 or greater');

    const locations = normalizeZoneLocations(dto.locations);
    if (!locations.length) throw new ApiError(400, 'At least one valid location is required');

    try {
      return await prisma.shippingZone.create({
        data: {
          name: dto.name.trim(),
          price: Number(dto.price),
          isActive: dto.isActive ?? true,
          locations: {
            create: locations,
          },
        },
        include: ZONE_INCLUDE,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ApiError(409, 'A city is already assigned to another zone');
      }
      throw error;
    }
  }

  async updateZone(id: string, dto: UpdateShippingZoneDto) {
    await this.getZoneById(id);

    if (dto.price != null && Number(dto.price) < 0) {
      throw new ApiError(400, 'Zone price must be 0 or greater');
    }

    const hasLocationsUpdate = Array.isArray(dto.locations);
    const locations = hasLocationsUpdate ? normalizeZoneLocations(dto.locations) : [];
    if (hasLocationsUpdate && !locations.length) {
      throw new ApiError(400, 'At least one valid location is required');
    }

    try {
      return await prisma.$transaction(async (tx) => {
        if (hasLocationsUpdate) {
          await tx.shippingZoneLocation.deleteMany({ where: { zoneId: id } });
        }

        return tx.shippingZone.update({
          where: { id },
          data: {
            name: dto.name?.trim(),
            price: dto.price != null ? Number(dto.price) : undefined,
            isActive: dto.isActive,
            locations: hasLocationsUpdate
              ? {
                  create: locations,
                }
              : undefined,
          },
          include: ZONE_INCLUDE,
        });
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ApiError(409, 'A city is already assigned to another zone');
      }
      throw error;
    }
  }

  async deleteZone(id: string) {
    await this.getZoneById(id);
    await prisma.shippingZone.delete({ where: { id } });
    return true;
  }

  async quoteByLocation(country: string, city: string) {
    const normalizedCountry = (country ?? '').trim();
    const normalizedCity = (city ?? '').trim();

    if (!normalizedCountry || !normalizedCity) {
      throw new ApiError(400, 'country and city are required');
    }

    const location = await prisma.shippingZoneLocation.findFirst({
      where: {
        country: {
          equals: normalizedCountry,
          mode: 'insensitive',
        },
        city: {
          equals: normalizedCity,
          mode: 'insensitive',
        },
        zone: {
          isActive: true,
        },
      },
      include: {
        zone: true,
      },
    });

    if (!location || !location.zone) {
      throw new ApiError(404, 'No shipping zone found for this city');
    }

    return {
      zone: location.zone,
      price: location.zone.price,
      location: {
        country: location.country,
        city: location.city,
      },
    };
  }

  async getMethods() {
    return prisma.shippingMethod.findMany({
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getMethodById(id: string) {
    const method = await prisma.shippingMethod.findUnique({ where: { id } });
    if (!method) throw new ApiError(404, 'Shipping method not found');
    return method;
  }

  async createMethod(dto: CreateShippingMethodDto) {
    if (!dto.name?.trim()) throw new ApiError(400, 'Method name is required');
    if (dto.price == null || Number(dto.price) < 0) throw new ApiError(400, 'Price must be 0 or greater');
    if (dto.estimatedDaysMin && dto.estimatedDaysMin < 0) {
      throw new ApiError(400, 'estimatedDaysMin cannot be negative');
    }
    if (dto.estimatedDaysMax && dto.estimatedDaysMax < 0) {
      throw new ApiError(400, 'estimatedDaysMax cannot be negative');
    }
    if (
      dto.estimatedDaysMin != null &&
      dto.estimatedDaysMax != null &&
      dto.estimatedDaysMin > dto.estimatedDaysMax
    ) {
      throw new ApiError(400, 'estimatedDaysMin must be less than or equal to estimatedDaysMax');
    }

    return prisma.shippingMethod.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        price: Number(dto.price),
        estimatedDaysMin: dto.estimatedDaysMin ?? null,
        estimatedDaysMax: dto.estimatedDaysMax ?? null,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateMethod(id: string, dto: UpdateShippingMethodDto) {
    await this.getMethodById(id);

    if (dto.price != null && Number(dto.price) < 0) {
      throw new ApiError(400, 'Price must be 0 or greater');
    }

    const min = dto.estimatedDaysMin;
    const max = dto.estimatedDaysMax;
    if (min != null && min < 0) throw new ApiError(400, 'estimatedDaysMin cannot be negative');
    if (max != null && max < 0) throw new ApiError(400, 'estimatedDaysMax cannot be negative');
    if (min != null && max != null && min > max) {
      throw new ApiError(400, 'estimatedDaysMin must be less than or equal to estimatedDaysMax');
    }

    return prisma.shippingMethod.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        description: dto.description != null ? dto.description.trim() || null : undefined,
        price: dto.price != null ? Number(dto.price) : undefined,
        estimatedDaysMin: dto.estimatedDaysMin,
        estimatedDaysMax: dto.estimatedDaysMax,
        isActive: dto.isActive,
      },
    });
  }

  async deleteMethod(id: string) {
    await this.getMethodById(id);
    await prisma.shippingMethod.delete({ where: { id } });
    return true;
  }

  async getShipments() {
    return prisma.shipment.findMany({
      include: SHIPMENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getShipmentById(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: SHIPMENT_INCLUDE,
    });
    if (!shipment) throw new ApiError(404, 'Shipment not found');
    return shipment;
  }

  async createShipment(dto: CreateShipmentDto) {
    if (!dto.orderId?.trim()) throw new ApiError(400, 'orderId is required');

    const order = await prisma.order.findUnique({
      where: { id: dto.orderId },
      select: { id: true },
    });
    if (!order) throw new ApiError(404, 'Order not found');

    const existingShipment = await prisma.shipment.findUnique({
      where: { orderId: dto.orderId },
      select: { id: true },
    });
    if (existingShipment) throw new ApiError(409, 'This order already has a shipment');

    if (dto.shippingMethodId) {
      const method = await prisma.shippingMethod.findUnique({
        where: { id: dto.shippingMethodId },
        select: { id: true },
      });
      if (!method) throw new ApiError(404, 'Shipping method not found');
    }

    if (dto.status && !validateStatus(dto.status)) {
      throw new ApiError(400, 'Invalid shipment status');
    }

    return prisma.shipment.create({
      data: {
        orderId: dto.orderId,
        shippingMethodId: dto.shippingMethodId || null,
        carrier: dto.carrier?.trim() || null,
        trackingNumber: dto.trackingNumber?.trim() || null,
        status: dto.status ?? 'PENDING',
        shippedAt: toValidDate(dto.shippedAt),
        deliveredAt: toValidDate(dto.deliveredAt),
        notes: dto.notes?.trim() || null,
      },
      include: SHIPMENT_INCLUDE,
    });
  }

  async updateShipment(id: string, dto: UpdateShipmentDto) {
    await this.getShipmentById(id);

    if (dto.shippingMethodId) {
      const method = await prisma.shippingMethod.findUnique({
        where: { id: dto.shippingMethodId },
        select: { id: true },
      });
      if (!method) throw new ApiError(404, 'Shipping method not found');
    }

    if (dto.status && !validateStatus(dto.status)) {
      throw new ApiError(400, 'Invalid shipment status');
    }

    return prisma.shipment.update({
      where: { id },
      data: {
        shippingMethodId: dto.shippingMethodId === undefined ? undefined : dto.shippingMethodId || null,
        carrier: dto.carrier === undefined ? undefined : dto.carrier?.trim() || null,
        trackingNumber:
          dto.trackingNumber === undefined ? undefined : dto.trackingNumber?.trim() || null,
        status: dto.status,
        shippedAt: dto.shippedAt === undefined ? undefined : toValidDate(dto.shippedAt) || null,
        deliveredAt:
          dto.deliveredAt === undefined ? undefined : toValidDate(dto.deliveredAt) || null,
        notes: dto.notes === undefined ? undefined : dto.notes?.trim() || null,
      },
      include: SHIPMENT_INCLUDE,
    });
  }

  async deleteShipment(id: string) {
    await this.getShipmentById(id);
    await prisma.shipment.delete({ where: { id } });
    return true;
  }
}
