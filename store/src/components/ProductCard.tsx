import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getProductImage } from '@/lib/image';

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-gray-50">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        <h3 className="font-medium text-brand line-clamp-1">{product.name}</h3>
        <p className="mt-2 font-semibold">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
