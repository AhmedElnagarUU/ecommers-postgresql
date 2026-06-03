'use client';

import React from 'react';
import { Users, ShoppingCart, DollarSign, TrendingUp, LucideIcon } from 'lucide-react';
import type { DashboardPageStats } from '../types';

interface DashboardMobileProps {
  stats: DashboardPageStats | null;
  loading: boolean;
  displayName: string;
}

interface MobileStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  positive?: boolean;
  loading: boolean;
}

function MobileStatCard({ title, value, icon: Icon, positive = true, loading }: MobileStatCardProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-4 border border-mintlify-accent/5">
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-lg bg-mintlify-hover/50" />
          <div className="h-3 w-16 rounded bg-mintlify-hover/50" />
          <div className="h-5 w-12 rounded bg-mintlify-hover/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-4 border border-mintlify-accent/5">
      <div className="w-10 h-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center mb-3">
        <Icon className={`w-5 h-5 ${positive ? 'text-mintlify-accent' : 'text-red-400'}`} />
      </div>
      <p className="text-xs text-mintlify-text-secondary">{title}</p>
      <p className="text-lg font-bold text-mintlify-text mt-1">{value}</p>
    </div>
  );
}

export function DashboardMobile({ stats, loading, displayName }: DashboardMobileProps) {
  const isGrowthPositive = (stats?.totalGrowth || 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-mintlify-text">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-mintlify-text-secondary">
          Here's your store overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <MobileStatCard
          title="Total Customers"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          loading={loading}
        />
        <MobileStatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          loading={loading}
        />
        <MobileStatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() ?? 0}`}
          icon={DollarSign}
          loading={loading}
        />
        <MobileStatCard
          title="Growth Rate"
          value={`${Math.abs(stats?.totalGrowth || 0)}%`}
          icon={TrendingUp}
          positive={isGrowthPositive}
          loading={loading}
        />
      </div>

      {/* Recent activity */}
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-4 border border-mintlify-accent/5">
        <h2 className="text-base font-bold text-mintlify-text mb-4">Recent Activity</h2>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-mintlify-hover/50" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-mintlify-hover/50" />
                  <div className="h-3 w-1/3 rounded bg-mintlify-hover/50" />
                </div>
              </div>
            ))}
          </div>
        ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-5 w-5 text-mintlify-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-mintlify-text truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-mintlify-text-secondary">
                    ${order.amount.toLocaleString()} - {order.status}
                  </p>
                </div>
                <div className="text-xs text-mintlify-text-secondary shrink-0">
                  {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-mintlify-text-secondary">No recent activity.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardMobile;
