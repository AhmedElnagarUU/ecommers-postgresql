'use client';

import { useEffect, useState } from 'react';
import { storeApi } from '@/lib/services';
import type { Category, Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { useLocale } from '@/contexts/LocaleContext';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">{t('shop.title')}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white border border-gray-200 rounded-xl">
        <input
          type="search"
          placeholder={t('shop.search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm"
        >
          <option value="">{t('shop.all')}</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder={t('shop.minPrice')}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full md:w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder={t('shop.maxPrice')}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full md:w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">{t('shop.noResults')}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
