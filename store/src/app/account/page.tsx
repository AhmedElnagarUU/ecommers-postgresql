'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { storeApi } from '@/lib/services';
import type { Order } from '@/lib/types';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { ButtonLink } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Container } from '@/shared/ui/Container';
import { EmptyState } from '@/shared/ui/EmptyState';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export default function AccountPage() {
  const { t } = useLocale();
  const { customer, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    storeApi.getMyOrders().then(setOrders).catch(() => setOrders([]));
  }, [token, router]);

  if (!customer) return null;

  return (
    <Container className="py-10">
      <SectionHeader
        eyebrow="Customer area"
        title={t('nav.account')}
        description={`${customer.name} - ${customer.email}`}
        action={<ButtonLink href="/products" variant="secondary">{t('cart.continue')}</ButtonLink>}
      />

      <Card className="p-6">
        <h2 className="text-xl font-black text-brand">{t('orders.title')}</h2>
        {orders.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={t('orders.empty')} description="Completed orders will appear here after checkout." />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/track-order?email=${encodeURIComponent(customer.email)}&orderNumber=${encodeURIComponent(order.orderNumber)}`}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-sky-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black text-brand">#{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {t('orders.status')}: <span className="capitalize">{order.status}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black text-brand">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </Container>
  );
}
