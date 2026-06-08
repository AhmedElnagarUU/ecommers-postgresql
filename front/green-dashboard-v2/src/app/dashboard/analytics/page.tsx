'use client';

import { useEffect, useState } from 'react';
import { AnalyticsStats } from '@/features/analytics/components/AnalyticsStats';
import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart';
import { AnalyticsTable } from '@/features/analytics/components/AnalyticsTable';
import { analyticsService } from '@/features/analytics/api/analytics.api';
import type { DashboardStats } from '@/features/dashboard/types';
import type { SalesDataPoint } from '@/features/analytics/api/analytics.api';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<DashboardStats['topProducts']>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, salesData, topProductsData] = await Promise.all([
          analyticsService.getStats(),
          analyticsService.getSalesAnalytics(30),
          analyticsService.getTopProducts(),
        ]);
        setStats(statsData);
        setSales(salesData);
        setTopProducts(topProductsData);
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-mintlify-bg p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-mintlify-text">Analytics</h1>
        <p className="text-mintlify-text-secondary">
          Track your business performance and growth
        </p>
      </div>

      <div className="fixed top-1/4 left-1/2 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      <div className="relative space-y-6">
        <AnalyticsStats loading={loading} stats={stats} />
        <AnalyticsChart loading={loading} sales={sales} />
        <AnalyticsTable loading={loading} products={topProducts} />
      </div>
    </div>
  );
}
