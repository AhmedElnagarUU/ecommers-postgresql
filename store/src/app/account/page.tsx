'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { storeApi } from '@/lib/services';
import type { Order } from '@/lib/types';

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">{t('nav.account')}</h1>
      <p className="text-gray-600 mb-8">
        {customer.name} · {customer.email}
      </p>

      <h2 className="text-xl font-medium mb-4">{t('orders.title')}</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">{t('orders.empty')}</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">#{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {t('orders.status')}: {order.status} · ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <Link href="/products" className="inline-block mt-8 text-brand-accent hover:underline">
        {t('cart.continue')}
      </Link>
    </div>
  );
}
