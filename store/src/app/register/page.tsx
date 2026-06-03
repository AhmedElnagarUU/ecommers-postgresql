'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { Button } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';

export default function RegisterPage() {
  const { t } = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
      router.push('/account');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <AuthCard
        title={t('auth.register')}
        subtitle="Create an account for faster checkout and order history."
        footer={
          <>
            {t('auth.hasAccount')}{' '}
            <Link href="/login" className="font-semibold text-sky-500 hover:underline">
              {t('auth.login')}
            </Link>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('checkout.name')} required />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t('checkout.email')}
            required
          />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t('checkout.phone')} />
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={t('auth.password')}
            required
            minLength={6}
          />
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? '...' : t('auth.register')}
          </Button>
        </form>
      </AuthCard>
    </Container>
  );
}
