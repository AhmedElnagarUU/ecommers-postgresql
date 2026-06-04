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

export interface CreatePixelDTO {
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled?: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export interface UpdatePixelDTO {
  platform?: PixelPlatform;
  label?: string;
  pixelId?: string;
  enabled?: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export const PIXEL_PLATFORM_LABELS: Record<PixelPlatform, string> = {
  meta: 'Meta Pixel',
  google_ga4: 'Google GA4',
  google_ads: 'Google Ads',
  tiktok: 'TikTok Pixel',
  snapchat: 'Snapchat Pixel',
  gtm: 'Google Tag Manager',
};

export const PIXEL_ID_PLACEHOLDERS: Record<PixelPlatform, string> = {
  meta: 'Meta Pixel ID',
  google_ga4: 'G-XXXXXXXXXX',
  google_ads: 'AW-XXXXXXXXX',
  tiktok: 'TikTok Pixel ID',
  snapchat: 'Snapchat Pixel ID',
  gtm: 'GTM-XXXXXXX',
};
