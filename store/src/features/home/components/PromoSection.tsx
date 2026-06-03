import { ArrowRight, BadgeCheck, CreditCard, PackageSearch } from 'lucide-react';
import { ButtonLink } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';

const benefits = [
  { icon: PackageSearch, title: 'Easy discovery', text: 'Clear categories, search, and product cards built for browsing.' },
  { icon: CreditCard, title: 'Cash on delivery', text: 'Checkout supports fast guest orders and customer accounts.' },
  { icon: BadgeCheck, title: 'Order tracking', text: 'Customers can follow every order with email and order number.' },
];

export function PromoSection() {
  return (
    <Container className="py-10">
      <section className="overflow-hidden rounded-[3rem] bg-brand text-white shadow-2xl shadow-slate-300">
        <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div className="relative min-h-72 rounded-[2.4rem] bg-gradient-to-br from-sky-300 via-cyan-200 to-white p-6 text-brand">
            <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-white/70" />
            <div className="absolute bottom-8 left-8 h-28 w-28 rotate-12 rounded-[2rem] bg-amber-200/80" />
            <div className="relative mt-16 max-w-xs rounded-[2rem] bg-white/85 p-5 shadow-soft backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Store design</p>
              <h3 className="mt-3 text-3xl font-black leading-tight">Soft, modern, and easy to maintain.</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">Customer experience</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
              Built like a real storefront, not just a product list.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="rounded-[1.7rem] bg-white/10 p-4">
                    <Icon className="h-6 w-6 text-sky-200" />
                    <h3 className="mt-4 font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
            <ButtonLink href="/products" size="lg" className="mt-8 w-fit">
              Start shopping <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </Container>
  );
}
