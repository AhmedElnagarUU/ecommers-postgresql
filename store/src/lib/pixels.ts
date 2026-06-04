import type { PublicPixel } from './pixel-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchEnabledPixels(): Promise<PublicPixel[]> {
  try {
    const response = await fetch(`${API_URL}/store/pixels`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const json = await response.json();
    return (json.data ?? []) as PublicPixel[];
  } catch {
    return [];
  }
}
