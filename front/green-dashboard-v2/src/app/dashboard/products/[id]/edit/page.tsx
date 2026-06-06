'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Layers } from 'lucide-react';
import { productService } from '@/features/products/api/product.api';
import { variantApi, VariantRow, OptionTypeInput } from '@/features/products/api/variant.api';
import { OptionBuilder } from '@/features/products/components/OptionBuilder';
import { VariantsTable } from '@/features/products/components/VariantsTable';
import type { Product } from '@/features/products/types';
import { Loading } from '@/shared/ui/Loading';
import { useToast } from '@/shared/hooks/useToast';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [p, v] = await Promise.all([
          productService.getProduct(id),
          variantApi.getVariants(id),
        ]);
        setProduct(p);
        setVariants(v);
      } catch (err: any) {
        error(err?.response?.data?.message ?? 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /** Called after OptionBuilder saves — refresh the variants list. */
  const handleOptionsSaved = (newVariants: VariantRow[]) => {
    setVariants(newVariants);
  };

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div className="p-8 text-center text-mintlify-text-secondary">
        Product not found.
      </div>
    );
  }

  // Build OptionTypeInput[] from the product's variantGroups for OptionBuilder's initialOptions.
  const initialOptions: OptionTypeInput[] = (product.variantGroups ?? []).map((g) => ({
    name: g.name,
    values: g.options,
  }));

  return (
    <div className="min-h-screen p-6">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/products')}
            className="p-2 rounded-lg text-mintlify-text-secondary hover:text-mintlify-text
              hover:bg-mintlify-hover/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-mintlify-text">Manage Variants</h1>
            <p className="text-mintlify-text-secondary text-sm flex items-center gap-1.5 mt-0.5">
              <Package className="w-4 h-4" />
              {product.name}
            </p>
          </div>
        </div>

        {/* ── Section 1: Option Builder ─────────────────────────────────────── */}
        <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-mintlify-accent" />
            <h2 className="text-lg font-semibold text-mintlify-text">Option Types</h2>
          </div>
          <p className="text-sm text-mintlify-text-secondary">
            Define the option types (e.g. Color, Size) and their values. Saving will generate all
            variant combinations automatically.
          </p>
          <OptionBuilder
            productId={id}
            initialOptions={initialOptions}
            onSaved={handleOptionsSaved}
          />
        </div>

        {/* ── Section 2: Variants Table ─────────────────────────────────────── */}
        <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-mintlify-accent" />
            <h2 className="text-lg font-semibold text-mintlify-text">Variants</h2>
          </div>

          {!product.hasVariants && variants.length === 0 ? (
            <p className="text-sm text-mintlify-text-secondary">
              Add option types above to generate variants.
            </p>
          ) : (
            <VariantsTable
              productId={id}
              variants={variants}
              onVariantsChange={setVariants}
            />
          )}
        </div>
      </div>
    </div>
  );
}
