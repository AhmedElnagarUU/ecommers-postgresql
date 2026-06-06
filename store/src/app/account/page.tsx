'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { storeApi } from '@/lib/services';
import type { CustomerAddress, Order } from '@/lib/types';
import { formatCurrency, formatDate } from '@/shared/lib/format';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Container } from '@/shared/ui/Container';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Input } from '@/shared/ui/Input';
import { SectionHeader } from '@/shared/ui/SectionHeader';

const emptyAddressForm = {
  label: 'Home',
  recipientName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  isDefault: true,
};

export default function AccountPage() {
  const { t } = useLocale();
  const { customer, token, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      router.push('/login');
      return;
    }
    storeApi.getMyOrders().then(setOrders).catch(() => setOrders([]));
    storeApi.getAddresses().then(setAddresses).catch(() => setAddresses([]));
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!customer) return;
    setProfileForm({
      name: customer.name,
      phone: customer.phone || '',
    });
    if (customer.addresses?.length) {
      setAddresses(customer.addresses);
    }
  }, [customer]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        currentPassword: passwordForm.currentPassword || undefined,
        newPassword: passwordForm.newPassword || undefined,
      });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Profile updated');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Profile update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      await storeApi.createAddress(addressForm);
      const nextAddresses = await storeApi.getAddresses();
      setAddresses(nextAddresses);
      setAddressForm(emptyAddressForm);
      toast.success('Address saved');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Address save failed');
    } finally {
      setSavingAddress(false);
    }
  };

  const makeDefaultAddress = async (id: string) => {
    try {
      await storeApi.updateAddress(id, { isDefault: true });
      setAddresses(await storeApi.getAddresses());
      toast.success('Default address updated');
    } catch {
      toast.error('Could not update address');
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await storeApi.deleteAddress(id);
      setAddresses(await storeApi.getAddresses());
      toast.success('Address deleted');
    } catch {
      toast.error('Could not delete address');
    }
  };

  if (isLoading || !customer) return null;

  return (
    <Container className="py-10">
      <SectionHeader
        eyebrow="Customer area"
        title={t('nav.account')}
        description={`${customer.name} - ${customer.email}`}
        action={<ButtonLink href="/products" variant="secondary">{t('cart.continue')}</ButtonLink>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-black text-brand">Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep your name and phone number ready for checkout and order updates.
            </p>
            <form onSubmit={submitProfile} className="mt-6 space-y-4">
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm((current) => ({ ...current, name: e.target.value }))}
                placeholder={t('checkout.name')}
                required
              />
              <Input value={customer.email} placeholder={t('checkout.email')} disabled />
              <Input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((current) => ({ ...current, phone: e.target.value }))}
                placeholder={t('checkout.phone')}
              />

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-bold text-brand">Change password</p>
                <div className="mt-3 grid gap-3">
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                    placeholder="Current password"
                  />
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                    placeholder="New password"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save profile'}
                </Button>
                <Button type="button" variant="secondary" onClick={logout}>
                  Logout
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-brand">Saved location</h2>
            <p className="mt-1 text-sm text-slate-500">
              Save delivery details so future orders include your location and phone number.
            </p>
            <form onSubmit={submitAddress} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  value={addressForm.label}
                  onChange={(e) => setAddressForm((current) => ({ ...current, label: e.target.value }))}
                  placeholder="Label"
                />
                <Input
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm((current) => ({ ...current, recipientName: e.target.value }))}
                  placeholder="Recipient name"
                />
              </div>
              <Input
                value={addressForm.phone}
                onChange={(e) => setAddressForm((current) => ({ ...current, phone: e.target.value }))}
                placeholder={t('checkout.phone')}
                required
              />
              <Input
                value={addressForm.street}
                onChange={(e) => setAddressForm((current) => ({ ...current, street: e.target.value }))}
                placeholder={t('checkout.street')}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  value={addressForm.city}
                  onChange={(e) => setAddressForm((current) => ({ ...current, city: e.target.value }))}
                  placeholder={t('checkout.city')}
                  required
                />
                <Input
                  value={addressForm.state}
                  onChange={(e) => setAddressForm((current) => ({ ...current, state: e.target.value }))}
                  placeholder={t('checkout.state')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  value={addressForm.zipCode}
                  onChange={(e) => setAddressForm((current) => ({ ...current, zipCode: e.target.value }))}
                  placeholder={t('checkout.zip')}
                  required
                />
                <Input
                  value={addressForm.country}
                  onChange={(e) => setAddressForm((current) => ({ ...current, country: e.target.value }))}
                  placeholder={t('checkout.country')}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm((current) => ({ ...current, isDefault: e.target.checked }))}
                />
                Use as default delivery address
              </label>
              <Button type="submit" disabled={savingAddress}>
                {savingAddress ? 'Saving...' : 'Save address'}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-black text-brand">Locations</h2>
            {addresses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No saved locations yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-brand">
                          {address.label || 'Delivery address'}{' '}
                          {address.isDefault && <span className="text-xs text-sky-500">(default)</span>}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {[address.street, address.city, address.state, address.zipCode, address.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button type="button" size="sm" variant="secondary" onClick={() => makeDefaultAddress(address.id)}>
                            Default
                          </Button>
                        )}
                        <Button type="button" size="sm" variant="ghost" onClick={() => deleteAddress(address.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

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
        </div>
      </div>
    </Container>
  );
}
