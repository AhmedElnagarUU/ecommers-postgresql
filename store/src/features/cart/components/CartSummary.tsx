import { ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/format';
import { ButtonLink } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

interface CartSummaryProps {
  totalLabel: string;
  checkoutLabel: string;
  totalPrice: number;
  count: number;
}

export function CartSummary({ totalLabel, checkoutLabel, totalPrice, count }: CartSummaryProps) {
  return (
    <Card className="sticky top-24 p-6">
      <h2 className="text-xl font-black text-brand">Order summary</h2>
      <div className="mt-5 space-y-3 text-sm text-slate-500">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{count}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="my-5 h-px bg-slate-100" />
      <div className="flex items-center justify-between">
        <span className="font-bold text-brand">{totalLabel}</span>
        <span className="text-2xl font-black text-brand">{formatCurrency(totalPrice)}</span>
      </div>
      <ButtonLink href="/checkout" className="mt-6 w-full">
        {checkoutLabel}
      </ButtonLink>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        Secure checkout with cash on delivery.
      </p>
    </Card>
  );
}
