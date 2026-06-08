import React from 'react';
import type { DashboardStats } from '@/features/dashboard/types';

interface AnalyticsTableProps {
  loading?: boolean;
  products?: DashboardStats['topProducts'];
}

export function AnalyticsTable({ loading, products = [] }: AnalyticsTableProps) {
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
      <div className="px-6 py-4 border-b border-mintlify-accent/10">
        <h3 className="text-lg font-semibold text-mintlify-text">Top Products</h3>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mintlify-accent/10">
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">Product</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">Units Sold</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-mintlify-text-secondary">
                  No product sales yet
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-mintlify-hover/20">
                  <td className="px-6 py-4 text-sm font-medium text-mintlify-text">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-mintlify-text-secondary">{item.sales}</td>
                  <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                    ${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
