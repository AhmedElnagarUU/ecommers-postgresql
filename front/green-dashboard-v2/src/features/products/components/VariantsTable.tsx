'use client';

import React, { useState } from 'react';
import { Save, Trash2, Loader2 } from 'lucide-react';
import {
  variantApi,
  VariantRow,
  BulkVariantUpdate,
  combinationLabel,
} from '../api/variant.api';
import { useToast } from '@/shared/hooks/useToast';

interface VariantsTableProps {
  productId: string;
  variants: VariantRow[];
  onVariantsChange: (variants: VariantRow[]) => void;
}

type DraftRow = BulkVariantUpdate & {
  combinationLabel: string;
  isActive: boolean;
};

export function VariantsTable({ productId, variants, onVariantsChange }: VariantsTableProps) {
  const [drafts, setDrafts] = useState<DraftRow[]>(() =>
    variants.map((v) => ({
      id: v.id,
      price: v.price ?? undefined,
      stock: v.stock,
      sku: v.sku ?? '',
      isActive: v.isActive,
      combinationLabel: combinationLabel(v.combination),
    }))
  );
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error } = useToast();

  // Keep drafts in sync when external variants prop changes (e.g. after option save).
  React.useEffect(() => {
    setDrafts(
      variants.map((v) => ({
        id: v.id,
        price: v.price ?? undefined,
        stock: v.stock,
        sku: v.sku ?? '',
        isActive: v.isActive,
        combinationLabel: combinationLabel(v.combination),
      }))
    );
  }, [variants]);

  const patchDraft = (id: string, patch: Partial<DraftRow>) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  // ── Save all ──────────────────────────────────────────────────────────────

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload: BulkVariantUpdate[] = drafts.map((d) => ({
        id: d.id,
        price: d.price !== undefined ? Number(d.price) : undefined,
        stock: Number(d.stock ?? 0),
        sku: d.sku || undefined,
        isActive: d.isActive,
      }));
      const updated = await variantApi.bulkUpdate(productId, payload);
      onVariantsChange(
        variants.map((v) => {
          const u = updated.find((x) => x.id === v.id);
          return u ?? v;
        })
      );
      success('All variants saved');
    } catch (err: any) {
      error(err?.response?.data?.message ?? 'Failed to save variants');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (variantId: string) => {
    if (!confirm('Delete this variant? This cannot be undone.')) return;
    setDeletingId(variantId);
    try {
      await variantApi.deleteVariant(variantId);
      const next = variants.filter((v) => v.id !== variantId);
      onVariantsChange(next);
      success('Variant deleted');
    } catch (err: any) {
      error(err?.response?.data?.message ?? 'Failed to delete variant');
    } finally {
      setDeletingId(null);
    }
  };

  if (variants.length === 0) {
    return (
      <p className="text-sm text-mintlify-text-secondary">
        Add option types above to generate variants.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-mintlify-text">
          Variants{' '}
          <span className="text-mintlify-text-secondary font-normal text-sm">
            ({variants.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mintlify-accent
            hover:bg-mintlify-accent-dark text-white text-sm transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-mintlify-accent/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mintlify-accent/10 text-mintlify-text-secondary text-xs">
              <th className="px-4 py-3 text-left font-medium">Combination</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Price ($)</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/5">
            {drafts.map((draft) => {
              const inactive = !draft.isActive;
              return (
                <tr
                  key={draft.id}
                  className={`transition-colors hover:bg-mintlify-hover/10 ${
                    inactive ? 'opacity-40' : ''
                  }`}
                >
                  {/* Combination */}
                  <td className="px-4 py-2 font-medium text-mintlify-text whitespace-nowrap">
                    {draft.combinationLabel}
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={draft.sku ?? ''}
                      onChange={(e) => patchDraft(draft.id, { sku: e.target.value })}
                      placeholder="SKU"
                      className="w-36 px-2 py-1 bg-mintlify-hover/30 text-mintlify-text
                        rounded focus:outline-none focus:ring-1 focus:ring-mintlify-accent/40 text-xs"
                    />
                  </td>

                  {/* Price */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price ?? ''}
                      onChange={(e) =>
                        patchDraft(draft.id, {
                          price: e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                      placeholder="Base price"
                      className="w-24 px-2 py-1 bg-mintlify-hover/30 text-mintlify-text
                        rounded focus:outline-none focus:ring-1 focus:ring-mintlify-accent/40 text-xs"
                    />
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      value={draft.stock ?? 0}
                      onChange={(e) => patchDraft(draft.id, { stock: Number(e.target.value) })}
                      className="w-20 px-2 py-1 bg-mintlify-hover/30 text-mintlify-text
                        rounded focus:outline-none focus:ring-1 focus:ring-mintlify-accent/40 text-xs"
                    />
                  </td>

                  {/* Active toggle */}
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={draft.isActive}
                      onClick={() => patchDraft(draft.id, { isActive: !draft.isActive })}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full
                        border-2 border-transparent transition-colors focus:outline-none
                        ${draft.isActive ? 'bg-mintlify-accent' : 'bg-mintlify-hover/50'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full
                          bg-white shadow ring-0 transition-transform
                          ${draft.isActive ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      disabled={deletingId === draft.id}
                      onClick={() => handleDelete(draft.id)}
                      className="p-1.5 rounded-lg text-mintlify-text-secondary
                        hover:text-red-400 hover:bg-red-500/10 transition-colors
                        disabled:opacity-40"
                    >
                      {deletingId === draft.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
