export type PixelPlatform =
  | 'meta'
  | 'google_ga4'
  | 'google_ads'
  | 'tiktok'
  | 'snapchat'
  | 'gtm';

export interface Pixel {
  id: string;
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export interface CreatePixelDto {
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled?: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export interface UpdatePixelDto {
  platform?: PixelPlatform;
  label?: string;
  pixelId?: string;
  enabled?: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export const PIXEL_PLATFORMS: PixelPlatform[] = [
  'meta',
  'google_ga4',
  'google_ads',
  'tiktok',
  'snapchat',
  'gtm',
];
