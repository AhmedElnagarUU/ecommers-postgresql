'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { storeApi } from '@/lib/services';

export default function CheckoutPage() {
  const { t } = useLocale();
  const { customer, token } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          selectedVariants: i.selectedVariants,
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
          phone: form.phone,
        },
        paymentMethod: 'cod',
      };

      if (!token) {
        body.guest = {
          name: form.name,
          email: form.email,
          phone: form.phone,
        };
      }

      const order = await storeApi.createOrder(body);
      await clearCart();
      toast.success(t('checkout.success'));
      router.push(`/track-order?email=${encodeURIComponent(form.email)}&orderNumber=${order.orderNumber}`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <p className="text-gray-600">{t('cart.empty')}</p>
        <Link href="/products" className="text-brand-accent mt-4 inline-block">
          {t('cart.continue')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2">{t('checkout.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">{t('checkout.cod')}</p>

      {!token && (
        <p className="text-sm mb-4">
          {t('checkout.loginHint')}{' '}
          <Link href="/login" className="text-brand-accent hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      )}

      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        {!token && (
          <>
            <input name="name" value={form.name} onChange={onChange} placeholder={t('checkout.name')} required className="w-full border rounded-lg px-4 py-2 text-sm" />
            <input name="email" type="email" value={form.email} onChange={onChange} placeholder={t('checkout.email')} required className="w-full border rounded-lg px-4 py-2 text-sm" />
          </>
        )}
        <input name="phone" value={form.phone} onChange={onChange} placeholder={t('checkout.phone')} className="w-full border rounded-lg px-4 py-2 text-sm" />
        <input name="street" value={form.street} onChange={onChange} placeholder={t('checkout.street')} required className="w-full border rounded-lg px-4 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" value={form.city} onChange={onChange} placeholder={t('checkout.city')} required className="border rounded-lg px-4 py-2 text-sm" />
          <input name="state" value={form.state} onChange={onChange} placeholder={t('checkout.state')} className="border rounded-lg px-4 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="zipCode" value={form.zipCode} onChange={onChange} placeholder={t('checkout.zip')} required className="border rounded-lg px-4 py-2 text-sm" />
          <input name="country" value={form.country} onChange={onChange} placeholder={t('checkout.country')} required className="border rounded-lg px-4 py-2 text-sm" />
        </div>

        <div className="flex justify-between pt-4 border-t font-medium">
          <span>{t('cart.total')}</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? '...' : t('checkout.placeOrder')}
        </button>
      </form>
    </div>
  );
}
