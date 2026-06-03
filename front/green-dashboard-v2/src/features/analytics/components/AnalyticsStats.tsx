import React from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ElementType;
}

function StatsCard({ title, value, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-mintlify-text-secondary">{title}</p>
          <h3 className="text-2xl font-semibold text-mintlify-text">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-mintlify-accent' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% vs last month
            </p>
          )}
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
}

export function AnalyticsStats({ loading }: AnalyticsStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-24 bg-mintlify-accent/10 rounded"></div>
              <div className="h-8 w-32 bg-mintlify-accent/10 rounded"></div>
              <div className="h-4 w-20 bg-mintlify-accent/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Revenue Growth"
        value="$12,875"
        trend={12.5}
        icon={TrendingUp}
      />
      <StatsCard
        title="Active Users"
        value="1,234"
        trend={8.2}
        icon={Users}
      />
      <StatsCard
        title="Sales Count"
        value="854"
        trend={-2.4}
        icon={ShoppingBag}
      />
      <StatsCard
        title="Average Order"
        value="$235"
        trend={5.7}
        icon={DollarSign}
      />
    </div>
  );
} 