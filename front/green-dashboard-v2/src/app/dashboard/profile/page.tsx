'use client'
import React from 'react';
import { ProfileInfo } from '@/features/profile/components/ProfileInfo';
import { ProfileSettings } from '@/features/profile/components/ProfileSettings';
import { ProfileActivity } from '@/features/profile/components/ProfileActivity';

export default function ProfilePage() {
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
        <h1 className="text-2xl font-bold text-mintlify-text">Profile</h1>
        <p className="text-mintlify-text-secondary">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div>
          <ProfileInfo loading={loading} />
        </div>

        {/* Middle Column - Settings */}
        <div className="lg:col-span-2">
          <ProfileSettings loading={loading} />
        </div>

        {/* Bottom Column - Activity */}
        <div className="lg:col-span-3">
          <ProfileActivity loading={loading} />
        </div>
      </div>
    </div>
  );
} 