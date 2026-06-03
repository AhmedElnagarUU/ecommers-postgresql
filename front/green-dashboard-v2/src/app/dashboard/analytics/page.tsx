'use client';

import { useState } from 'react';
import { AnalyticsStats } from '@/features/analytics/components/AnalyticsStats';
import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart';
import { AnalyticsTable } from '@/features/analytics/components/AnalyticsTable';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-mintlify-bg p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-mintlify-text">Analytics</h1>
        <p className="text-mintlify-text-secondary">
          Track your business performance and growth
        </p>
      </div>

      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/2 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Content */}
      <div className="relative space-y-6">
        {/* Stats Section */}
        <AnalyticsStats loading={loading} />

        {/* Chart Section */}
        <AnalyticsChart loading={loading} />

        {/* Table Section */}
        <AnalyticsTable loading={loading} />
      </div>
    </div>
  );
} 