export function getProductImage(product: { imageUrls?: string[] }): string | null {
  const url = product.imageUrls?.[0];
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return null;
}
