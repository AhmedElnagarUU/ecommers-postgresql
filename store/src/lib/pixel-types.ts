export type PixelPlatform =
  | 'meta'
  | 'google_ga4'
  | 'google_ads'
  | 'tiktok'
  | 'snapchat'
  | 'gtm';

export interface PublicPixel {
  id: string;
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled: boolean;
}
