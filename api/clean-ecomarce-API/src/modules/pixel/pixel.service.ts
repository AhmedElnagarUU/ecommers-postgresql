import { randomUUID } from 'crypto';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import type { CreatePixelDto, Pixel, UpdatePixelDto } from './pixel.model';
import { PIXEL_PLATFORMS } from './pixel.model';

const DEFAULT_STORE_ID = 'default';

function parsePixels(value: unknown): Pixel[] {
  if (!Array.isArray(value)) return [];
  return value as Pixel[];
}

function sanitizeForPublic(pixel: Pixel): Omit<Pixel, 'accessToken' | 'testEventCode'> {
  const { accessToken: _accessToken, testEventCode: _testEventCode, ...rest } = pixel;
  return rest;
}

export class PixelService {
  private async getOrCreateStore() {
    return prisma.store.upsert({
      where: { id: DEFAULT_STORE_ID },
      create: { id: DEFAULT_STORE_ID, pixels: [] },
      update: {},
    });
  }

  private async savePixels(pixels: Pixel[]) {
    await prisma.store.upsert({
      where: { id: DEFAULT_STORE_ID },
      create: { id: DEFAULT_STORE_ID, pixels: pixels as object },
      update: { pixels: pixels as object },
    });
    return pixels;
  }

  async listPixels(includeSecrets: boolean): Promise<Pixel[] | Omit<Pixel, 'accessToken' | 'testEventCode'>[]> {
    const store = await this.getOrCreateStore();
    const pixels = parsePixels(store.pixels);

    if (includeSecrets) {
      return pixels;
    }

    return pixels.filter((p) => p.enabled).map(sanitizeForPublic);
  }

  async createPixel(dto: CreatePixelDto): Promise<Pixel> {
    if (!PIXEL_PLATFORMS.includes(dto.platform)) {
      throw new ApiError(400, 'Invalid pixel platform');
    }
    if (!dto.label?.trim() || !dto.pixelId?.trim()) {
      throw new ApiError(400, 'Label and pixel ID are required');
    }

    const store = await this.getOrCreateStore();
    const pixels = parsePixels(store.pixels);

    const pixel: Pixel = {
      id: randomUUID(),
      platform: dto.platform,
      label: dto.label.trim(),
      pixelId: dto.pixelId.trim(),
      enabled: dto.enabled ?? true,
      ...(dto.accessToken ? { accessToken: dto.accessToken.trim() } : {}),
      ...(dto.testEventCode ? { testEventCode: dto.testEventCode.trim() } : {}),
    };

    pixels.push(pixel);
    await this.savePixels(pixels);
    return pixel;
  }

  async updatePixel(pixelId: string, dto: UpdatePixelDto): Promise<Pixel> {
    const store = await this.getOrCreateStore();
    const pixels = parsePixels(store.pixels);
    const index = pixels.findIndex((p) => p.id === pixelId);

    if (index === -1) {
      throw new ApiError(404, 'Pixel not found');
    }

    const current = pixels[index];

    if (dto.platform !== undefined && !PIXEL_PLATFORMS.includes(dto.platform)) {
      throw new ApiError(400, 'Invalid pixel platform');
    }

    const updated: Pixel = {
      ...current,
      ...(dto.platform !== undefined ? { platform: dto.platform } : {}),
      ...(dto.label !== undefined ? { label: dto.label.trim() } : {}),
      ...(dto.pixelId !== undefined ? { pixelId: dto.pixelId.trim() } : {}),
      ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
    };

    if (dto.accessToken !== undefined) {
      if (dto.accessToken) {
        updated.accessToken = dto.accessToken.trim();
      } else {
        delete updated.accessToken;
      }
    }

    if (dto.testEventCode !== undefined) {
      if (dto.testEventCode) {
        updated.testEventCode = dto.testEventCode.trim();
      } else {
        delete updated.testEventCode;
      }
    }

    pixels[index] = updated;
    await this.savePixels(pixels);
    return updated;
  }

  async deletePixel(pixelId: string): Promise<void> {
    const store = await this.getOrCreateStore();
    const pixels = parsePixels(store.pixels);
    const filtered = pixels.filter((p) => p.id !== pixelId);

    if (filtered.length === pixels.length) {
      throw new ApiError(404, 'Pixel not found');
    }

    await this.savePixels(filtered);
  }

  async getEnabledMetaCapiPixels(): Promise<Pixel[]> {
    const store = await this.getOrCreateStore();
    const pixels = parsePixels(store.pixels);
    return pixels.filter(
      (p) => p.enabled && p.platform === 'meta' && p.accessToken && p.pixelId
    );
  }
}
