'use client';

import React, { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  VariantCombination,
  VariantGroup,
  buildCombinationKey,
  syncVariantCombinations,
} from '@/utils/variant.utils';

interface ProductVariantsEditorProps {
  hasVariants: boolean;
  variantGroups: VariantGroup[];
  variantCombinations: VariantCombination[];
  useVariantStock: boolean;
  useVariantPricing: boolean;
  onChange: (value: {
    hasVariants: boolean;
    variantGroups: VariantGroup[];
    variantCombinations: VariantCombination[];
    useVariantStock: boolean;
    useVariantPricing: boolean;
  }) => void;
}

export function ProductVariantsEditor({
  hasVariants,
  variantGroups,
  variantCombinations,
  useVariantStock,
  useVariantPricing,
  onChange,
}: ProductVariantsEditorProps) {
  const syncedCombinations = useMemo(
    () => syncVariantCombinations(variantGroups, variantCombinations, useVariantStock, useVariantPricing),
    [variantGroups, variantCombinations, useVariantStock, useVariantPricing]
  );

  const emitChange = (
    next: Partial<{
      hasVariants: boolean;
      variantGroups: VariantGroup[];
      variantCombinations: VariantCombination[];
      useVariantStock: boolean;
      useVariantPricing: boolean;
    }>
  ) => {
    const groups = next.variantGroups ?? variantGroups;
    const stock = next.useVariantStock ?? useVariantStock;
    const pricing = next.useVariantPricing ?? useVariantPricing;
    const combinations = syncVariantCombinations(
      groups,
      next.variantCombinations ?? variantCombinations,
      stock,
      pricing
    );

    onChange({
      hasVariants: next.hasVariants ?? hasVariants,
      variantGroups: groups,
      variantCombinations: combinations,
      useVariantStock: stock,
      useVariantPricing: pricing,
    });
  };

  const updateGroups = (groups: VariantGroup[]) => {
    emitChange({ variantGroups: groups });
  };

  const updateCombination = (index: number, field: 'stock' | 'price', value: number) => {
    const next = [...syncedCombinations];
    next[index] = { ...next[index], [field]: value };
    emitChange({ variantCombinations: next });
  };

  const addGroup = () => {
    updateGroups([...variantGroups, { name: '', options: [''] }]);
  };

  const removeGroup = (index: number) => {
    updateGroups(variantGroups.filter((_, i) => i !== index));
  };

  const updateGroup = (index: number, patch: Partial<VariantGroup>) => {
    updateGroups(
      variantGroups.map((group, i) => (i === index ? { ...group, ...patch } : group))
    );
  };

  const addOption = (groupIndex: number) => {
    const group = variantGroups[groupIndex];
    updateGroup(groupIndex, { options: [...group.options, ''] });
  };

  const updateOption = (groupIndex: number, optionIndex: number, value: string) => {
    const group = variantGroups[groupIndex];
    const options = [...group.options];
    options[optionIndex] = value;
    updateGroup(groupIndex, { options });
  };

  const removeOption = (groupIndex: number, optionIndex: number) => {
    const group = variantGroups[groupIndex];
    updateGroup(groupIndex, {
      options: group.options.filter((_, i) => i !== optionIndex),
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-mintlify-accent/10 p-4">
      <label className="flex items-center gap-2 text-sm font-medium text-mintlify-text">
        <input
          type="checkbox"
          checked={hasVariants}
          onChange={(e) =>
            emitChange({
              hasVariants: e.target.checked,
              variantGroups: e.target.checked ? variantGroups : [],
              variantCombinations: e.target.checked ? variantCombinations : [],
            })
          }
          className="rounded border-mintlify-accent/30"
        />
        This product has variants (optional)
      </label>

      {hasVariants && (
        <div className="space-y-4">
          <div className="space-y-3">
            {variantGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="rounded-lg bg-mintlify-hover/20 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Variant name (e.g. Color)"
                    value={group.name}
                    onChange={(e) => updateGroup(groupIndex, { name: e.target.value })}
                    className="flex-1 px-3 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeGroup(groupIndex)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-mintlify-text-secondary">Options</p>
                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Option value (e.g. Red)"
                        value={option}
                        onChange={(e) => updateOption(groupIndex, optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(groupIndex, optionIndex)}
                        className="p-2 text-mintlify-text-secondary hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(groupIndex)}
                    className="text-sm text-mintlify-accent hover:underline"
                  >
                    + Add option
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addGroup}
              className="flex items-center gap-2 text-sm text-mintlify-accent hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add variant group
            </button>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-mintlify-text">
              <input
                type="checkbox"
                checked={useVariantStock}
                onChange={(e) => emitChange({ useVariantStock: e.target.checked })}
              />
              Track stock per combination
            </label>
            <label className="flex items-center gap-2 text-sm text-mintlify-text">
              <input
                type="checkbox"
                checked={useVariantPricing}
                onChange={(e) => emitChange({ useVariantPricing: e.target.checked })}
              />
              Different price per combination (optional)
            </label>
          </div>

          {(useVariantStock || useVariantPricing) && syncedCombinations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-mintlify-text">
                <thead>
                  <tr className="text-left text-mintlify-text-secondary border-b border-mintlify-accent/10">
                    <th className="py-2 pr-4">Combination</th>
                    {useVariantStock && <th className="py-2 pr-4">Stock</th>}
                    {useVariantPricing && <th className="py-2">Price</th>}
                  </tr>
                </thead>
                <tbody>
                  {syncedCombinations.map((combo, index) => (
                    <tr key={buildCombinationKey(combo.selections)} className="border-b border-mintlify-accent/5">
                      <td className="py-2 pr-4">
                        {Object.entries(combo.selections)
                          .map(([name, value]) => `${name}: ${value}`)
                          .join(' / ')}
                      </td>
                      {useVariantStock && (
                        <td className="py-2 pr-4">
                          <input
                            type="number"
                            min="0"
                            value={combo.stock ?? 0}
                            onChange={(e) => updateCombination(index, 'stock', Number(e.target.value))}
                            className="w-24 px-2 py-1 bg-mintlify-hover/30 rounded"
                          />
                        </td>
                      )}
                      {useVariantPricing && (
                        <td className="py-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={combo.price ?? ''}
                            placeholder="Base price"
                            onChange={(e) => updateCombination(index, 'price', Number(e.target.value))}
                            className="w-28 px-2 py-1 bg-mintlify-hover/30 rounded"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
