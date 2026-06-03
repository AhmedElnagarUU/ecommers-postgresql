import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark';

const variants: Record<Variant, string> = {
  primary: 'bg-sky-500 text-white shadow-soft shadow-sky-200/70 hover:bg-sky-600',
  secondary: 'bg-white text-brand border border-slate-200 shadow-sm hover:border-sky-200 hover:text-sky-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/70 hover:text-brand',
  dark: 'bg-brand text-white shadow-soft shadow-slate-300/50 hover:bg-brand-light',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-sm',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: keyof typeof sizes;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({ className, variant = 'primary', size = 'md', href, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
