import Link from 'next/link';
import { ArrowRight, Mail, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { Container } from '@/shared/ui/Container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-brand text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black text-brand">S</span>
            <span className="text-xl font-black">
              Classi<span className="text-sky-300">Ads</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
            A bright customer store for curated products, quick checkout, and easy order tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <Truck className="h-4 w-4" /> Fast delivery
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <ShieldCheck className="h-4 w-4" /> Secure checkout
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><Link href="/products" className="hover:text-white">All products</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-white">Checkout</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">Support</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><Link href="/track-order" className="hover:text-white">Track order</Link></li>
            <li><Link href="/account" className="hover:text-white">Account</Link></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> help@classiads.store</li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-white/10 p-5">
          <PackageCheck className="h-8 w-8 text-sky-300" />
          <h3 className="mt-4 font-bold">Ready to browse?</h3>
          <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 hover:text-white">
            Explore products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
      <Container className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        (c) {year} ClassiAds. All rights reserved.
      </Container>
    </footer>
  );
}
