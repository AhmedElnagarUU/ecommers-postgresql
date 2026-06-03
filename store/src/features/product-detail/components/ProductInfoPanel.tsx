import { ShoppingBag, Star, Truck } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { VariantSelector } from './VariantSelector';

interface ProductInfoPanelProps {
  product: Product;
  price: number;
  selections: Record<string, string>;
  addLabel: string;
  onVariantChange: (groupName: string, value: string) => void;
  onAdd: () => void;
}

export function ProductInfoPanel({ product, price, selections, addLabel, onVariantChange, onAdd }: ProductInfoPanelProps) {
  return (
    <Card className="p-6 md:p-8">
      <Badge>{product.category || 'Product'}</Badge>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-brand">{product.name}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-3xl font-black text-brand">{formatCurrency(price)}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
          <Star className="h-4 w-4 fill-current" /> 4.8 customer rating
        </span>
      </div>
      <p className="mt-5 leading-7 text-slate-500">{product.description}</p>

      <div className="my-8 h-px bg-slate-100" />
      <VariantSelector groups={product.variantGroups} selections={selections} onChange={onVariantChange} />

      <div className="mt-8 rounded-[1.7rem] bg-sky-50 p-4 text-sm text-slate-600">
        <Truck className="mb-2 h-5 w-5 text-sky-500" />
        Fast checkout with cash on delivery. You can track the order after placing it.
      </div>

      <Button type="button" onClick={onAdd} size="lg" className="mt-8 w-full">
        <ShoppingBag className="h-5 w-5" />
        {addLabel}
      </Button>
    </Card>
  );
}
