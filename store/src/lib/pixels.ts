import { getApiRoot } from './api';
import type { PublicPixel } from './pixel-types';

export async function fetchEnabledPixels(): Promise<PublicPixel[]> {
  try {
    const response = await fetch(`${getApiRoot()}/store/pixels`, {
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
