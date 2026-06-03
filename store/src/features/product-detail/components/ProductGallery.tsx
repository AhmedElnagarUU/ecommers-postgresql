import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getProductImage } from '@/shared/lib/image';

export function ProductGallery({ product }: { product: Product }) {
  const image = getProductImage(product);
  const thumbnails = product.imageUrls?.filter((url) => url.startsWith('http://') || url.startsWith('https://')).slice(0, 4) || [];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-white bg-gradient-to-br from-slate-50 to-sky-50 shadow-soft">
        {image ? (
          <Image src={image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      {thumbnails.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {thumbnails.map((thumb) => (
            <div key={thumb} className="relative aspect-square overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
              <Image src={thumb} alt={product.name} fill sizes="120px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
