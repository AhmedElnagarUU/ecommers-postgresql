'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { ButtonLink } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { customer, logout } = useAuth();
  const { count } = useCart();

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.shop') },
    { href: '/track-order', label: t('nav.track') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-lg font-black text-white shadow-soft">
            S
          </span>
          <span className="text-lg font-black tracking-tight text-brand">
            Classi<span className="text-sky-500">Ads</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 p-1 text-sm font-medium text-slate-500 shadow-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 transition hover:bg-sky-50 hover:text-sky-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/products" className="hidden rounded-full p-3 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 sm:block">
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
          >
            {locale === 'en' ? 'AR' : 'EN'}
          </button>
          <Link href="/cart" className="relative rounded-full bg-white p-3 text-brand shadow-sm transition hover:text-sky-600">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {customer ? (
            <>
              <Link href="/account" className="rounded-full bg-white p-3 text-brand shadow-sm transition hover:text-sky-600">
                <User className="h-5 w-5" />
              </Link>
              <button type="button" onClick={logout} className="hidden text-sm font-semibold text-slate-500 transition hover:text-brand md:block">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <ButtonLink href="/login" size="sm" variant="dark" className="hidden sm:inline-flex">
              <Heart className="h-4 w-4" />
              {t('nav.login')}
            </ButtonLink>
          )}
        </div>
      </Container>
    </header>
  );
}
