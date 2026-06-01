'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { storeApi } from '@/lib/services';
import type { Order } from '@/lib/types';

function TrackOrderContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const track = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setOrder(null);
    try {
      const result = await storeApi.trackOrder(email, orderNumber);
      setOrder(result);
    } catch {
      setError('Order not found');
    }
  };

  useEffect(() => {
    if (searchParams.get('email') && searchParams.get('orderNumber')) {
      track();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">{t('orders.trackTitle')}</h1>

      <form onSubmit={track} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('checkout.email')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder={t('orders.orderNumber')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <button type="submit" className="w-full bg-brand text-white py-3 rounded-full text-sm font-medium">
          {t('orders.track')}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {order && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="font-semibold text-lg">#{order.orderNumber}</p>
          <p className="text-sm text-gray-600 mt-2">
            {t('orders.status')}: <span className="capitalize">{order.status}</span>
          </p>
          <p className="text-sm text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item, i) => {
              const name = typeof item.product === 'object' ? item.product?.name : 'Item';
              const variants = item.selectedVariants
                ? Object.entries(item.selectedVariants)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')
                : '';
              return (
                <li key={i} className="border-t pt-2">
                  {name} × {item.quantity}
                  {variants && <span className="text-gray-500 block">{variants}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-gray-500">Loading...</p>}>
      <TrackOrderContent />
    </Suspense>
  );
}
