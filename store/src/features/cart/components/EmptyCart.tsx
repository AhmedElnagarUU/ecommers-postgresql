import { ShoppingBag } from 'lucide-react';
import { ButtonLink } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export function EmptyCart({ title, actionLabel }: { title: string; actionLabel: string }) {
  return (
    <Card className="mx-auto max-w-xl p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-sky-50 text-sky-500">
        <ShoppingBag className="h-9 w-9" />
      </div>
      <h1 className="mt-6 text-2xl font-black text-brand">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Add products you love and they will appear here.</p>
      <ButtonLink href="/products" className="mt-7">
        {actionLabel}
      </ButtonLink>
    </Card>
  );
}
