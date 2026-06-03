import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

const fieldClass =
  'w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-brand outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, className)} {...props} />;
}
