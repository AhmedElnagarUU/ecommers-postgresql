'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">{t('auth.login')}</h1>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('checkout.email')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-3 rounded-full text-sm font-medium"
        >
          {t('auth.login')}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-600">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="text-brand-accent hover:underline">
          {t('auth.register')}
        </Link>
      </p>
    </div>
  );
}
