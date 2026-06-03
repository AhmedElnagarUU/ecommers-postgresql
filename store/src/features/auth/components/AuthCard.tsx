import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/shared/ui/Card';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[3rem] bg-white shadow-2xl shadow-sky-100 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden bg-gradient-to-br from-sky-300 via-cyan-100 to-white p-10 lg:block">
        <div className="absolute right-10 top-10 h-24 w-24 rounded-full bg-white/70" />
        <div className="absolute bottom-10 left-10 h-28 w-28 rotate-12 rounded-[2rem] bg-amber-200/80" />
        <div className="relative flex h-full flex-col justify-end">
          <Sparkles className="h-10 w-10 text-brand" />
          <h2 className="mt-5 text-4xl font-black leading-tight text-brand">Welcome to a smoother shopping experience.</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">Sign in to manage orders, cart items, and delivery details.</p>
        </div>
      </div>
      <Card className="rounded-none border-0 p-6 shadow-none sm:p-10">
        <h1 className="text-3xl font-black tracking-tight text-brand">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
      </Card>
    </div>
  );
}
