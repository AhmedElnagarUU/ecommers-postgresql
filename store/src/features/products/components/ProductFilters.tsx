'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category } from '@/lib/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input, Select } from '@/shared/ui/Input';

interface ProductFiltersProps {
  categories: Category[];
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  labels: {
    search: string;
    all: string;
    minPrice: string;
    maxPrice: string;
  };
  onQChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  categories,
  q,
  category,
  minPrice,
  maxPrice,
  labels,
  onQChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}: ProductFiltersProps) {
  return (
    <Card className="mb-8 p-4">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_0.7fr_0.7fr_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder={labels.search}
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            className="pl-11"
          />
        </label>
        <Select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">{labels.all}</option>
          {categories.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
        <Input type="number" placeholder={labels.minPrice} value={minPrice} onChange={(e) => onMinPriceChange(e.target.value)} />
        <Input type="number" placeholder={labels.maxPrice} value={maxPrice} onChange={(e) => onMaxPriceChange(e.target.value)} />
        <Button type="button" variant="secondary" onClick={onClear} className="w-full lg:w-auto">
          <SlidersHorizontal className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </Card>
  );
}
