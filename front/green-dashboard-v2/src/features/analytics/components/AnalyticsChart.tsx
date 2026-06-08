import React from 'react';
import type { SalesDataPoint } from '../api/analytics.api';

interface AnalyticsChartProps {
  loading?: boolean;
  sales?: SalesDataPoint[];
}

export function AnalyticsChart({ loading, sales = [] }: AnalyticsChartProps) {
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

  const maxRevenue = Math.max(...sales.map((point) => point.revenue), 1);

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl p-6 border border-mintlify-accent/10">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-mintlify-text">Revenue (last 30 days)</h3>

        {sales.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-mintlify-text-secondary">No sales data for this period</p>
          </div>
        ) : (
          <div className="h-[300px] flex items-end gap-2 overflow-x-auto pb-2">
            {sales.map((point) => (
              <div key={point.date} className="flex flex-col items-center min-w-[48px] gap-2">
                <div
                  className="w-10 rounded-t bg-mintlify-accent/70"
                  style={{ height: `${Math.max((point.revenue / maxRevenue) * 220, 8)}px` }}
                  title={`$${point.revenue.toFixed(2)} · ${point.orders} orders`}
                />
                <span className="text-[10px] text-mintlify-text-secondary rotate-[-45deg] origin-top-left whitespace-nowrap">
                  {point.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
