import Link from 'next/link';
import { storeApi } from '@/lib/services';
import { ProductCard } from '@/components/ProductCard';
import { HomeHero } from '@/components/HomeHero';

export default async function HomePage() {
  let products = [];
  try {
    products = await storeApi.getProducts();
  } catch {
    products = [];
  }

  const featured = products.slice(0, 4);

  return (
    <div>
      <HomeHero />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Featured</h2>
          <Link href="/products" className="text-sm text-brand-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
