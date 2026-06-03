'use client';

import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';
import { ButtonLink } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';

export function HomeHero() {
  const { t } = useLocale();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute left-1/2 top-0 -z-10 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute right-10 top-24 -z-10 h-28 w-28 rotate-12 rounded-[2rem] bg-amber-200/80 blur-sm" />
      <div className="absolute bottom-14 left-8 -z-10 h-24 w-24 rounded-full bg-cyan-200/70 blur-sm" />

      <Container className="grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-bold text-sky-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Fresh picks, smooth shopping
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-brand sm:text-6xl lg:text-7xl">
            {t('home.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">{t('home.subtitle')}</p>

          <div className="mt-8 max-w-xl rounded-full border border-white bg-white p-2 shadow-soft">
            <Link href="/products" className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <Search className="h-5 w-5" />
              </span>
              <span className="flex-1 text-sm font-medium text-slate-400">{t('shop.search')}</span>
              <span className="hidden rounded-full bg-brand px-5 py-3 text-sm font-bold text-white sm:inline-flex">Search</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/products" size="lg">
              {t('home.cta')} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/track-order" variant="secondary" size="lg">
              {t('nav.track')}
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
              <Truck className="h-5 w-5 text-sky-500" />
              Fast cash-on-delivery checkout
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Secure customer account area
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-8 -top-8 h-24 w-24 rotate-12 rounded-[2rem] bg-sky-300/70" />
          <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-amber-300/80" />
          <div className="relative overflow-hidden rounded-[3rem] border border-white bg-white/75 p-4 shadow-2xl shadow-sky-100 backdrop-blur">
            <div className="rounded-[2.4rem] bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[2rem] bg-white p-4 shadow-soft">
                  <div className="h-32 rounded-[1.5rem] bg-gradient-to-br from-slate-100 to-sky-100" />
                  <div className="mt-4 h-3 w-20 rounded-full bg-slate-100" />
                  <div className="mt-2 h-3 w-28 rounded-full bg-slate-100" />
                </div>
                <div className="mt-10 rounded-[2rem] bg-brand p-4 text-white shadow-soft">
                  <div className="h-24 rounded-[1.5rem] bg-white/15" />
                  <p className="mt-4 text-xs text-sky-200">Featured</p>
                  <p className="text-2xl font-black">$120</p>
                </div>
                <div className="rounded-[2rem] bg-cyan-100 p-4 shadow-soft">
                  <div className="h-20 rounded-[1.5rem] bg-white/70" />
                  <p className="mt-4 text-sm font-bold text-brand">Furniture</p>
                </div>
                <div className="rounded-[2rem] bg-amber-100 p-4 shadow-soft">
                  <div className="h-20 rounded-[1.5rem] bg-white/70" />
                  <p className="mt-4 text-sm font-bold text-brand">Electronics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
