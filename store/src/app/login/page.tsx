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

export default function LoginPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      router.push('/account');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <AuthCard
        title={t('auth.login')}
        subtitle="Access your orders and saved cart."
        footer={
          <>
            {t('auth.noAccount')}{' '}
            <Link href="/register" className="font-semibold text-sky-500 hover:underline">
              {t('auth.register')}
            </Link>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('checkout.email')} required />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            required
          />
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? '...' : t('auth.login')}
          </Button>
        </form>
      </AuthCard>
    </Container>
  );
}
