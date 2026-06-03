import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getProductImage } from '@/shared/lib/image';
import { formatCurrency } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/Badge';

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-soft shadow-slate-200/80 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">No image</div>
        )}
        <div className="absolute left-3 top-3">
          <Badge className="border-white/80 bg-white/90 text-slate-600 shadow-sm">{product.category || 'Product'}</Badge>
        </div>
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm transition group-hover:text-rose-500">
          <Heart className="h-4 w-4" />
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>4.8</span>
          <span className="text-slate-300">-</span>
          <span className="text-slate-400">{product.stock > 0 ? 'In stock' : 'Limited'}</span>
        </div>
        <h3 className="line-clamp-1 font-bold text-brand">{product.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-black text-brand">{formatCurrency(product.price)}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition group-hover:bg-sky-500">
            <ShoppingBag className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
