import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600',
        className
      )}
      {...props}
    />
  );
}
