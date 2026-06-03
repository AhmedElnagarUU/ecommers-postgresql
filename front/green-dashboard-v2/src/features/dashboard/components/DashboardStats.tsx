'use client';

import { LoadingSpinner } from '@/shared/ui/Loading';
import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { dashboardService } from '@/features/dashboard/api/dashboard.api';
import { useApi } from '@/shared/hooks/useApi';

export default function DashboardStats() {
  const { data: stats, isLoading } = useApi(
    dashboardService.getStats,
    { showToast: false }
  );

  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        trend={{ value: 12, label: "vs last month" }}
      />
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders.toString()}
        icon={ShoppingCart}
        trend={{ value: 8, label: "vs last month" }}
      />
      <StatsCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        icon={Package}
        description="Active products"
      />
      <StatsCard
        title="Total Customers"
        value={stats.totalCustomers.toString()}
        icon={Users}
        trend={{ value: 5, label: "vs last month" }}
      />
    </div>
  );
} 