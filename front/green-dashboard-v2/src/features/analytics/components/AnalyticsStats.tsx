import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import type { DashboardStats } from '@/features/dashboard/types';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-mintlify-text-secondary">{title}</p>
          <h3 className="text-2xl font-semibold text-mintlify-text">{value}</h3>
        </div>
        <div className="h-12 w-12 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-mintlify-accent" />
        </div>
      </div>
    </div>
  );
}

interface AnalyticsStatsProps {
  loading?: boolean;
  stats?: DashboardStats | null;
}

export function AnalyticsStats({ loading, stats }: AnalyticsStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-24 bg-mintlify-accent/10 rounded"></div>
              <div className="h-8 w-32 bg-mintlify-accent/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const avgOrder = stats && stats.totalOrders > 0
    ? stats.totalRevenue / stats.totalOrders
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={`$${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={TrendingUp}
      />
      <StatsCard
        title="Customers"
        value={(stats?.totalCustomers ?? 0).toLocaleString()}
        icon={Users}
      />
      <StatsCard
        title="Orders"
        value={(stats?.totalOrders ?? 0).toLocaleString()}
        icon={ShoppingBag}
      />
      <StatsCard
        title="Average Order"
        value={`$${avgOrder.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={DollarSign}
      />
    </div>
  );
}
