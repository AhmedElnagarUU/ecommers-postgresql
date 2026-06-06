'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Plus, Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { variantApi, OptionTypeInput, VariantRow } from '../api/variant.api';
import { useToast } from '@/shared/hooks/useToast';

interface OptionBuilderProps {
  productId: string;
  /** Current option types (name + values arrays). */
  initialOptions: OptionTypeInput[];
  onSaved: (variants: VariantRow[]) => void;
}

export function OptionBuilder({ productId, initialOptions, onSaved }: OptionBuilderProps) {
  const [options, setOptions] = useState<OptionTypeInput[]>(
    initialOptions.length ? initialOptions : []
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const { success, error } = useToast();

  const mark = () => setDirty(true);

  // ── Option type mutations ─────────────────────────────────────────────────

  const addOptionType = () => {
    setOptions((prev) => [...prev, { name: '', values: [] }]);
    mark();
  };

  const removeOptionType = (i: number) => {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    mark();
  };

  const updateOptionTypeName = (i: number, name: string) => {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, name } : o)));
    mark();
  };

  // ── Value chip mutations ──────────────────────────────────────────────────

  const addValue = (i: number) => {
    const raw = (inputValues[i] ?? '').trim();
    if (!raw) return;
    setOptions((prev) =>
      prev.map((o, idx) =>
        idx === i && !o.values.includes(raw)
          ? { ...o, values: [...o.values, raw] }
          : o
      )
    );
    setInputValues((prev) => ({ ...prev, [i]: '' }));
    mark();
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx ? { ...o, values: o.values.filter((_, vi) => vi !== valIdx) } : o
      )
    );
    mark();
  };

  const handleInputKey = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue(i);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    const valid = options.filter((o) => o.name.trim() && o.values.length > 0);
    setSaving(true);
    try {
      const result = await variantApi.setOptionTypes(productId, valid);
      onSaved(result.variants);
      setDirty(false);
      success('Options saved — variants reconciled successfully');
    } catch (err: any) {
      error(err?.response?.data?.message ?? 'Failed to save options');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-mintlify-text">Option Types</h3>
        <button
          type="button"
          onClick={addOptionType}
          className="flex items-center gap-1.5 text-sm text-mintlify-accent hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add option type
        </button>
      </div>

      {/* Warning banner */}
      {dirty && options.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm text-yellow-300">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Saving will regenerate variants. Existing matching combinations will be preserved.
          </span>
        </div>
      )}

      {/* Option type list */}
      <div className="space-y-3">
        {options.map((opt, i) => (
          <div
            key={i}
            className="rounded-lg border border-mintlify-accent/10 bg-mintlify-hover/10 p-4 space-y-3"
          >
            {/* Type name row */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder='Option name (e.g. "Color")'
                value={opt.name}
                onChange={(e) => updateOptionTypeName(i, e.target.value)}
                className="flex-1 px-3 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-mintlify-accent/40 text-sm"
              />
              <button
                type="button"
                onClick={() => removeOptionType(i)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Value chips */}
            <div className="space-y-2">
              <p className="text-xs text-mintlify-text-secondary">Values</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val, vi) => (
                  <span
                    key={vi}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                      bg-mintlify-accent/15 text-mintlify-accent text-xs"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => removeValue(i, vi)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {/* Tag input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder='Type a value and press Enter (e.g. "Red")'
                  value={inputValues[i] ?? ''}
                  onChange={(e) => setInputValues((prev) => ({ ...prev, [i]: e.target.value }))}
                  onKeyDown={(e) => handleInputKey(e, i)}
                  className="flex-1 px-3 py-1.5 bg-mintlify-hover/30 text-mintlify-text rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-mintlify-accent/40 text-sm"
                />
                <button
                  type="button"
                  onClick={() => addValue(i)}
                  className="px-2 py-1.5 rounded-lg bg-mintlify-accent/10 text-mintlify-accent
                    hover:bg-mintlify-accent/20 text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}

        {options.length === 0 && (
          <p className="text-sm text-mintlify-text-secondary">
            No option types yet. Click &ldquo;Add option type&rdquo; to start.
          </p>
        )}
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !dirty}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mintlify-accent
          hover:bg-mintlify-accent-dark text-white text-sm transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Options
      </button>
    </div>
  );
}
