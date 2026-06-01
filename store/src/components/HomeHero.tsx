'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';

export function HomeHero() {
  const { t } = useLocale();

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-brand tracking-tight max-w-2xl mx-auto">
          {t('home.title')}
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">{t('home.subtitle')}</p>
        <Link
          href="/products"
          className="inline-block mt-8 bg-brand text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-brand-light transition-colors"
        >
          {t('home.cta')}
        </Link>
      </div>
    </section>
  );
}
