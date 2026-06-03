'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { storeApi } from '@/lib/services';
import type { Order } from '@/lib/types';
import { formatCurrency } from '@/shared/lib/format';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import { SectionHeader } from '@/shared/ui/SectionHeader';

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
    <Container className="py-10">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="Support" title={t('orders.trackTitle')} description="Enter the email and order number from checkout." />

        <Card className="mb-8 p-6">
          <form onSubmit={track} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('checkout.email')} required />
            <Input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder={t('orders.orderNumber')} required />
            <Button type="submit" className="w-full sm:w-auto">
              {t('orders.track')}
            </Button>
          </form>
        </Card>

        {error && <p className="mb-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-500">{error}</p>}

        {order && (
          <Card className="p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400">{t('orders.orderNumber')}</p>
                <p className="text-2xl font-black text-brand">#{order.orderNumber}</p>
              </div>
              <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold capitalize text-sky-600">
                {t('orders.status')}: {order.status}
              </div>
            </div>
            <p className="mt-4 text-lg font-black text-brand">Total: {formatCurrency(order.totalAmount)}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {order.items.map((item, index) => {
                const name = typeof item.product === 'object' ? item.product?.name : 'Item';
                const variants = item.selectedVariants
                  ? Object.entries(item.selectedVariants)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')
                  : '';
                return (
                  <li key={index} className="rounded-2xl bg-slate-50 p-4">
                    <span className="font-bold text-brand">
                      {name} x {item.quantity}
                    </span>
                    {variants && <span className="mt-1 block text-slate-500">{variants}</span>}
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>
    </Container>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-slate-500">Loading...</p>}>
      <TrackOrderContent />
    </Suspense>
  );
}
