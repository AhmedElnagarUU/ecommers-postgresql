'use client';

import React from 'react';
import { GeneralSettings } from '@/components/dashboard/settings/GeneralSettings';
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings';
import { IntegrationSettings } from '@/components/dashboard/settings/IntegrationSettings';

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-mintlify-dark to-mintlify-darker opacity-80" />
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mintlify-text">Settings</h1>
        <p className="text-mintlify-text-secondary">
          Configure your application settings and preferences
        </p>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {/* General Settings */}
        <GeneralSettings loading={loading} />

        {/* Security Settings */}
        <SecuritySettings loading={loading} />

        {/* Integration Settings */}
        <IntegrationSettings loading={loading} />
      </div>
    </div>
  );
} 