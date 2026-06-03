/** URLs that Next.js <Image> can load */
export function isNextImageSrc(src: string): boolean {
  return (
    src.startsWith('https://') ||
    src.startsWith('http://') ||
    src.startsWith('/')
  );
}

/** blob: previews from local file picker */
export function isBlobImageSrc(src: string): boolean {
  return src.startsWith('blob:');
}

export function getDisplayableImageUrls(
  imageUrls?: string[],
  images?: string[]
): string[] {
  const fromUrls = (imageUrls || []).filter(isNextImageSrc);
  if (fromUrls.length > 0) return fromUrls;
  // Never pass raw storage keys (e.g. products/xxx.png) to next/image
  return [];
}
