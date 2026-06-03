import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { getProductImage } from '@/shared/lib/image';
import { formatCurrency } from '@/shared/lib/format';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const image = getProductImage({ imageUrls: item.imageUrls });
  const variantLabel = item.selectedVariants
    ? Object.entries(item.selectedVariants)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    : '';

  return (
    <div className="grid gap-4 rounded-[1.7rem] border border-white bg-white p-4 shadow-soft sm:grid-cols-[96px_1fr_auto]">
      <div className="relative h-24 overflow-hidden rounded-2xl bg-slate-50">
        {image ? <Image src={image} alt={item.name} fill sizes="96px" className="object-cover" /> : null}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-brand">{item.name}</h3>
        {variantLabel && <p className="mt-1 text-xs text-slate-500">{variantLabel}</p>}
        <p className="mt-2 font-black text-brand">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
          <button type="button" onClick={() => onUpdateQuantity(item.quantity - 1)} className="h-8 w-8 rounded-full bg-white font-bold text-slate-500">
            -
          </button>
          <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
          <button type="button" onClick={() => onUpdateQuantity(item.quantity + 1)} className="h-8 w-8 rounded-full bg-white font-bold text-slate-500">
            +
          </button>
        </div>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50">
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  );
}
