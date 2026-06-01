'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { storeApi } from '@/lib/services';
import type { Product } from '@/lib/types';
import { getProductImage } from '@/lib/image';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/contexts/CartContext';

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
      .then((p) => {
        setProduct(p);
        if (p.hasVariants && p.variantGroups) {
          const initial: Record<string, string> = {};
          p.variantGroups.forEach((g) => {
            if (g.options[0]) initial[g.name] = g.options[0];
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
          .map((k) => [k, selections[k]])
      );
      const combo = product.variantCombinations.find(
        (c) =>
          JSON.stringify(
            Object.keys(c.selections)
              .sort()
              .map((k) => [k, c.selections[k]])
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

  if (loading) return <p className="p-8 text-center text-gray-500">Loading...</p>;
  if (!product) return <p className="p-8 text-center text-gray-500">Product not found</p>;

  const image = getProductImage(product);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden">
          {image ? (
            <Image src={image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No image</div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">{product.category}</p>
          <h1 className="text-3xl font-semibold mt-1">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">${price.toFixed(2)}</p>
          <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

          {product.hasVariants && product.variantGroups?.map((group) => (
            <div key={group.name} className="mt-6">
              <label className="block text-sm font-medium mb-2">{group.name}</label>
              <div className="flex flex-wrap gap-2">
                {group.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, [group.name]: opt }))}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selections[group.name] === opt
                        ? 'border-brand bg-brand text-white'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="mt-8 bg-brand text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-brand-light"
          >
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
