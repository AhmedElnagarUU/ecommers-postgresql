'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';
import { storeApi } from '@/lib/services';
import type { CustomerAddress } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Container } from '@/shared/ui/Container';
import { Input, Select } from '@/shared/ui/Input';
import { SectionHeader } from '@/shared/ui/SectionHeader';

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
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: customer?.name || current.name,
      email: customer?.email || current.email,
      phone: customer?.phone || current.phone,
    }));
  }, [customer]);

  useEffect(() => {
    if (!token) return;
    storeApi
      .getAddresses()
      .then((savedAddresses) => {
        setAddresses(savedAddresses);
        const defaultAddress = savedAddresses.find((address) => address.isDefault) || savedAddresses[0];
        if (defaultAddress) {
          applyAddress(defaultAddress);
        }
      })
      .catch(() => setAddresses([]));
  }, [token]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (['phone', 'street', 'city', 'state', 'zipCode', 'country'].includes(e.target.name)) {
      setSelectedAddressId('');
    }
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const applyAddress = (address: CustomerAddress) => {
    setSelectedAddressId(address.id);
    setForm((current) => ({
      ...current,
      phone: address.phone || current.phone,
      street: address.street,
      city: address.city,
      state: address.state || '',
      zipCode: address.zipCode,
      country: address.country,
    }));
  };

  const onAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    const address = addresses.find((item) => item.id === addressId);
    if (address) applyAddress(address);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants,
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

      if (selectedAddressId) {
        body.addressId = selectedAddressId;
      }

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
      <Container className="py-16">
        <EmptyCart title={t('cart.empty')} actionLabel={t('cart.continue')} />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionHeader eyebrow="Checkout" title={t('checkout.title')} description={t('checkout.cod')} />

      {!token && (
        <p className="mb-4 text-sm text-slate-500">
          {t('checkout.loginHint')}{' '}
          <Link href="/login" className="font-semibold text-sky-500 hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card className="p-6 md:p-8">
          <form onSubmit={submit} className="space-y-4">
            {!token && (
              <>
                <Input name="name" value={form.name} onChange={onChange} placeholder={t('checkout.name')} required />
                <Input name="email" type="email" value={form.email} onChange={onChange} placeholder={t('checkout.email')} required />
              </>
            )}
            {addresses.length > 0 && (
              <Select value={selectedAddressId} onChange={onAddressSelect}>
                <option value="">Use a new delivery address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label || 'Saved address'} - {[address.city, address.country].filter(Boolean).join(', ')}
                  </option>
                ))}
              </Select>
            )}
            <Input name="phone" value={form.phone} onChange={onChange} placeholder={t('checkout.phone')} />
            <Input name="street" value={form.street} onChange={onChange} placeholder={t('checkout.street')} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="city" value={form.city} onChange={onChange} placeholder={t('checkout.city')} required />
              <Input name="state" value={form.state} onChange={onChange} placeholder={t('checkout.state')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="zipCode" value={form.zipCode} onChange={onChange} placeholder={t('checkout.zip')} required />
              <Input name="country" value={form.country} onChange={onChange} placeholder={t('checkout.country')} required />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? '...' : t('checkout.placeOrder')}
            </Button>
          </form>
        </Card>
        <div className="space-y-4">
          <CheckoutSummary items={items} totalPrice={totalPrice} />
          <Card className="p-5 text-sm leading-6 text-slate-500">
            Orders are saved after checkout, and customers can track them with email plus order number.
          </Card>
        </div>
      </div>
    </Container>
  );
}
