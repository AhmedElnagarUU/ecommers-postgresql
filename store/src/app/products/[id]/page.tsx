'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { ProductGallery } from '@/features/product-detail/components/ProductGallery';
import { ProductInfoPanel } from '@/features/product-detail/components/ProductInfoPanel';
import { storeApi } from '@/lib/services';
import type { Product } from '@/lib/types';
import { Container } from '@/shared/ui/Container';
import { EmptyState } from '@/shared/ui/EmptyState';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLocale();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    storeApi
      .getProduct(id)
      .then((data) => {
        setProduct(data);
        if (data.hasVariants && data.variantGroups) {
          const initial: Record<string, string> = {};
          data.variantGroups.forEach((group) => {
            if (group.options[0]) initial[group.name] = group.options[0];
          });
          setSelections(initial);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const price = useMemo(() => {
    if (!product) return 0;
    if (product.hasVariants && product.useVariantPricing && product.variantCombinations) {
      const key = JSON.stringify(
        Object.keys(selections)
          .sort()
          .map((selectionKey) => [selectionKey, selections[selectionKey]])
      );
      const combo = product.variantCombinations.find(
        (candidate) =>
          JSON.stringify(
            Object.keys(candidate.selections)
              .sort()
              .map((selectionKey) => [selectionKey, candidate.selections[selectionKey]])
          ) === key
      );
      if (combo?.price !== undefined) return combo.price;
    }
    return product.price;
  }, [product, selections]);

  const handleAdd = async () => {
    if (!product) return;
    if (product.hasVariants) {
      for (const group of product.variantGroups || []) {
        if (!selections[group.name]) {
          alert(t('product.selectVariant'));
          return;
        }
      }
    }
    await addItem({
      productId: product._id,
      name: product.name,
      price,
      quantity: 1,
      selectedVariants: product.hasVariants ? selections : undefined,
      imageUrls: product.imageUrls,
    });
  };

  if (loading) return <p className="p-8 text-center text-slate-500">Loading...</p>;

  if (!product) {
    return (
      <Container className="py-16">
        <EmptyState title="Product not found" description="This product may have been removed or is no longer available." />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <ProductGallery product={product} />
        <ProductInfoPanel
          product={product}
          price={price}
          selections={selections}
          addLabel={t('product.addToCart')}
          onVariantChange={(groupName, value) => setSelections((current) => ({ ...current, [groupName]: value }))}
          onAdd={handleAdd}
        />
      </div>
    </Container>
  );
}
