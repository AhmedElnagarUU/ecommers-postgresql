import type { Product } from '@/lib/types';
import { ButtonLink } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyTitle: string;
  emptyDescription?: string;
}

export function ProductGrid({ products, emptyTitle, emptyDescription }: ProductGridProps) {
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<ButtonLink href="/products">Browse products</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
