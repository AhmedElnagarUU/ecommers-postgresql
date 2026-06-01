'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/contexts/CartContext';
import { getProductImage } from '@/lib/image';

export default function CartPage() {
  const { t } = useLocale();
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">{t('cart.empty')}</p>
        <Link href="/products" className="text-brand-accent hover:underline">
          {t('cart.continue')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">{t('cart.title')}</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const image = getProductImage({ imageUrls: item.imageUrls });
          const variantLabel = item.selectedVariants
            ? Object.entries(item.selectedVariants)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            : '';

          return (
            <div
              key={`${item.productId}-${variantLabel}`}
              className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                {image && <Image src={image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                {variantLabel && <p className="text-xs text-gray-500 mt-1">{variantLabel}</p>}
                <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariants)}
                    className="w-8 h-8 border rounded-lg"
                  >
                    −
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariants)}
                    className="w-8 h-8 border rounded-lg"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.selectedVariants)}
                    className="text-xs text-red-500 ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <span className="font-medium">{t('cart.total')}</span>
        <span className="text-xl font-semibold">${totalPrice.toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="block mt-6 text-center bg-brand text-white py-3 rounded-full font-medium hover:bg-brand-light"
      >
        {t('cart.checkout')}
      </Link>
    </div>
  );
}
