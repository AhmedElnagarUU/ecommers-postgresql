import { CategoryShowcase } from '@/features/home/components/CategoryShowcase';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
import { HomeHero } from '@/features/home/components/HomeHero';
import { PromoSection } from '@/features/home/components/PromoSection';
import { storeApi } from '@/lib/services';
import type { Category, Product } from '@/lib/types';

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productData, categoryData] = await Promise.all([storeApi.getProducts(), storeApi.getCategories()]);
    products = productData;
    categories = categoryData;
  } catch {
    products = [];
    categories = [];
  }

  return (
    <>
      <HomeHero />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={products.slice(0, 8)} />
      <PromoSection />
    </>
  );
}
