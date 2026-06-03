import type { ReactNode } from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="mx-auto max-w-xl p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-2xl">:)</div>
      <h2 className="text-xl font-bold text-brand">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
