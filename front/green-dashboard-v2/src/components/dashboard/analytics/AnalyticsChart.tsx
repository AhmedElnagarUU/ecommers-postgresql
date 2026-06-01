import React from 'react';

interface AnalyticsChartProps {
  loading?: boolean;
}

export function AnalyticsChart({ loading }: AnalyticsChartProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-mintlify-accent/10 rounded"></div>
          <div className="h-[300px] bg-mintlify-accent/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-mintlify-text">Revenue Overview</h3>
          <select className="bg-mintlify-hover/20 text-mintlify-text-secondary rounded-lg px-3 py-1 text-sm border border-mintlify-accent/10">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-mintlify-text-secondary">Chart will be implemented here</p>
        </div>
      </div>
    </div>
  );
} 