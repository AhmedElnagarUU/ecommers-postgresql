import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsData {
  page: string;
  visitors: number;
  percentage: number;
  trend: 'up' | 'down';
}

const sampleData: AnalyticsData[] = [
  { page: '/dashboard', visitors: 2345, percentage: 12.5, trend: 'up' },
  { page: '/products', visitors: 1876, percentage: -2.3, trend: 'down' },
  { page: '/orders', visitors: 1567, percentage: 8.7, trend: 'up' },
  { page: '/customers', visitors: 1234, percentage: 5.2, trend: 'up' },
  { page: '/analytics', visitors: 987, percentage: -1.5, trend: 'down' },
];

interface AnalyticsTableProps {
  loading?: boolean;
}

export function AnalyticsTable({ loading }: AnalyticsTableProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
        <div className="p-6 space-y-4">
          <div className="h-4 w-32 bg-mintlify-accent/10 rounded animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-4 w-48 bg-mintlify-accent/10 rounded"></div>
                <div className="h-4 w-24 bg-mintlify-accent/10 rounded"></div>
                <div className="h-4 w-20 bg-mintlify-accent/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mintlify-accent/10">
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Page
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Visitors
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/10">
            {sampleData.map((item) => (
              <tr key={item.page} className="hover:bg-mintlify-hover/20">
                <td className="px-6 py-4 text-sm font-medium text-mintlify-text">
                  {item.page}
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  {item.visitors.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    {item.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-mintlify-accent" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-mintlify-accent' : 'text-red-400'
                    }`}>
                      {Math.abs(item.percentage)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 