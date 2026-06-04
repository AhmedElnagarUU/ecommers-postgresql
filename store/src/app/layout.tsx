import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/shared/layout/Providers';
import { Header } from '@/shared/layout/Header';
import { Footer } from '@/shared/layout/Footer';
import { TrackingPixels } from '@/shared/tracking/TrackingPixels';
import { fetchEnabledPixels } from '@/lib/pixels';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ClassiAds Store',
  description: 'Modern ecommerce storefront for products, checkout, and order tracking.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pixels = await fetchEnabledPixels();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans`}>
        <TrackingPixels pixels={pixels} />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
