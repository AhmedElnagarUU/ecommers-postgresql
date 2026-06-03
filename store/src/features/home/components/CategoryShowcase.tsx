import Link from 'next/link';
import { Armchair, Car, Grid3X3, Headphones, Package, Shirt, Sofa } from 'lucide-react';
import type { Category } from '@/lib/types';
import { Card } from '@/shared/ui/Card';
import { Container } from '@/shared/ui/Container';

const icons = [Sofa, Car, Headphones, Armchair, Shirt, Package];

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const items = categories.length
    ? categories.slice(0, 6)
    : [
        { _id: 'furniture', name: 'Furniture', slug: 'furniture' },
        { _id: 'cars', name: 'Cars', slug: 'cars' },
        { _id: 'electronics', name: 'Electronics', slug: 'electronics' },
        { _id: 'fashion', name: 'Fashion', slug: 'fashion' },
      ];

  return (
    <Container className="py-6">
      <Card className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((category, index) => {
          const Icon = icons[index] || Grid3X3;
          return (
            <Link
              key={category._id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group flex items-center gap-3 rounded-[1.5rem] p-4 transition hover:bg-sky-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-sky-500">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand">{category.name}</span>
                <span className="text-xs text-slate-400">Explore deals</span>
              </span>
            </Link>
          );
        })}
      </Card>
    </Container>
  );
}
