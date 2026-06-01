'use client';

import Link from 'next/link';
import { ShoppingBag, User } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { customer, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold text-brand tracking-tight">
          Shop
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-brand">{t('nav.home')}</Link>
          <Link href="/products" className="hover:text-brand">{t('nav.shop')}</Link>
          <Link href="/track-order" className="hover:text-brand">{t('nav.track')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="text-xs border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50"
          >
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>

          <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-full">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {customer ? (
            <>
              <Link href="/account" className="p-2 hover:bg-gray-50 rounded-full" title={t('nav.account')}>
                <User className="w-5 h-5" />
              </Link>
              <button type="button" onClick={logout} className="text-sm text-gray-600 hover:text-brand">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-brand-accent hover:underline">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
