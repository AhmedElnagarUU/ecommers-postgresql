'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductSkeleton } from '@/features/products/components/ProductSkeleton';
import { storeApi } from '@/lib/services';
import type { Category, Product } from '@/lib/types';
import { Container } from '@/shared/ui/Container';
import { SectionHeader } from '@/shared/ui/SectionHeader';

export default function ProductsPage() {
  const { t } = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialCategory = new URLSearchParams(window.location.search).get('category');
    if (initialCategory) setCategory(initialCategory);
  }, []);

  useEffect(() => {
    storeApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    storeApi
      .getProducts(params)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setQ('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Container className="py-10">
      <SectionHeader
        eyebrow="Marketplace"
        title={t('shop.title')}
        description="Search, filter, and browse products with a clean customer-first layout."
      />

      <ProductFilters
        categories={categories}
        q={q}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        labels={{
          search: t('shop.search'),
          all: t('shop.all'),
          minPrice: t('shop.minPrice'),
          maxPrice: t('shop.maxPrice'),
        }}
        onQChange={setQ}
        onCategoryChange={setCategory}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onClear={clearFilters}
      />

      {loading ? (
        <ProductSkeleton />
      ) : (
        <ProductGrid products={products} emptyTitle={t('shop.noResults')} emptyDescription="Try changing the search term or price range." />
      )}
    </Container>
  );
}
