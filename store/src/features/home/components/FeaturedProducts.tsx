import type { Product } from '@/lib/types';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ButtonLink } from '@/shared/ui/Button';
import { Container } from '@/shared/ui/Container';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <Container className="py-14">
      <SectionHeader
        eyebrow="Fresh arrivals"
        title="Featured products"
        description="A curated set of products pulled directly from the store API."
        action={<ButtonLink href="/products" variant="secondary">View all</ButtonLink>}
      />
      <ProductGrid products={products} emptyTitle="No featured products yet" emptyDescription="Products will appear here after they are added from the dashboard." />
    </Container>
  );
}
