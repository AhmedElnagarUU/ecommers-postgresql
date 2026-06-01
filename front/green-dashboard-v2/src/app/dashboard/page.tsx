'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { dashboardService, DashboardStats } from '@/api/dashboard.api';

interface DashboardPageStats extends DashboardStats {
  totalGrowth: number;
}
  
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardPageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dashboardStats = await dashboardService.getStats();
        
        // Calculate growth rate based on recent orders trend
        const calculateGrowth = () => {
          if (!dashboardStats.recentOrders || dashboardStats.recentOrders.length < 2) return 0;
          
          // Get the total amount for the most recent orders (first half)
          const recentTotal = dashboardStats.recentOrders
            .slice(0, Math.floor(dashboardStats.recentOrders.length / 2))
            .reduce((sum, order) => sum + order.amount, 0);

          // Get the total amount for the older orders (second half)
          const oldTotal = dashboardStats.recentOrders
            .slice(Math.floor(dashboardStats.recentOrders.length / 2))
            .reduce((sum, order) => sum + order.amount, 0);

          // Calculate growth rate
          if (oldTotal === 0) return 0;
          const growth = ((recentTotal - oldTotal) / oldTotal) * 100;
          return Number(growth.toFixed(1));
        };

        const growthRate = calculateGrowth();

        setStats({
          ...dashboardStats,
          totalGrowth: growthRate
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Determine if growth is positive
  const isGrowthPositive = (stats?.totalGrowth || 0) > 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          loading={loading}
        />
        <DashboardCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          trend={{ value: 5.1, isPositive: true }}
          loading={loading}
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          loading={loading}
        />
        <DashboardCard
          title="Growth Rate"
          value={`${Math.abs(stats?.totalGrowth || 0)}%`}
          icon={TrendingUp}
          trend={{ value: Math.abs(stats?.totalGrowth || 0), isPositive: isGrowthPositive }}
          loading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden border border-mintlify-accent/5 hover:border-mintlify-accent/20">
        <h2 className="text-xl font-bold text-mintlify-text mb-4">Recent Activity</h2>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-mintlify-accent/10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-mintlify-accent/10 rounded w-1/4"></div>
                  <div className="h-3 bg-mintlify-accent/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {stats?.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-mintlify-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-mintlify-text">
                    New order from {order.customerName}
                  </p>
                  <p className="text-sm text-mintlify-text-secondary">
                    ${order.amount.toLocaleString()} - {order.status}
                  </p>
                </div>
                <div className="text-xs text-mintlify-text-secondary">
                  {new Date(order.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
} 