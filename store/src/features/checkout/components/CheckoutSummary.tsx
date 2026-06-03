import type { CartItem } from '@/lib/types';
import { formatCurrency } from '@/shared/lib/format';
import { Card } from '@/shared/ui/Card';

interface CheckoutSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export function CheckoutSummary({ items, totalPrice }: CheckoutSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-black text-brand">Your order</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${JSON.stringify(item.selectedVariants || {})}`} className="flex justify-between gap-4 text-sm">
            <div>
              <p className="font-bold text-brand">{item.name}</p>
              <p className="text-xs text-slate-500">Qty {item.quantity}</p>
            </div>
            <span className="font-bold text-brand">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="my-5 h-px bg-slate-100" />
      <div className="flex items-center justify-between">
        <span className="font-bold text-brand">Total</span>
        <span className="text-2xl font-black text-brand">{formatCurrency(totalPrice)}</span>
      </div>
    </Card>
  );
}
