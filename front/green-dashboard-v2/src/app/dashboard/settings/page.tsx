'use client';

import React from 'react';
import { GeneralSettings } from '@/features/settings/components/GeneralSettings';
import { SecuritySettings } from '@/features/settings/components/SecuritySettings';
import { IntegrationSettings } from '@/features/settings/components/IntegrationSettings';
import Link from 'next/link';
import { ChevronRight, Crosshair } from 'lucide-react';

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
        <Link
          href="/dashboard/settings/pixels"
          className="block bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6
            hover:border-mintlify-accent/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center text-mintlify-accent">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-mintlify-text">Pixels & Tracking</h3>
                <p className="text-sm text-mintlify-text-secondary">
                  Meta, Google, TikTok, Snapchat, and GTM pixels for your storefront
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-mintlify-text-secondary" />
          </div>
        </Link>

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