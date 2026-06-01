'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6">{t('auth.register')}</h1>
      <form onSubmit={submit} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={t('checkout.name')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={t('checkout.email')}
          required
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder={t('checkout.phone')}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={t('auth.password')}
          required
          minLength={6}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-3 rounded-full text-sm font-medium"
        >
          {t('auth.register')}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-600">
        {t('auth.hasAccount')}{' '}
        <Link href="/login" className="text-brand-accent hover:underline">
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}
