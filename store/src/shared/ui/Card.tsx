import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-white/70 bg-white/85 shadow-soft shadow-slate-200/70 backdrop-blur',
        className
      )}
      {...props}
    />
  );
}
