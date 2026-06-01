import React from 'react';
import { Globe, Mail, Bell, Moon } from 'lucide-react';

interface GeneralSettingsProps {
  loading?: boolean;
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingItem({ icon, title, description, children }: SettingItemProps) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex gap-3">
        <div className="mt-1 text-mintlify-text-secondary">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-mintlify-text">{title}</h3>
          <p className="text-sm text-mintlify-text-secondary">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
}

export function GeneralSettings({ loading }: GeneralSettingsProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 bg-mintlify-accent/10 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start justify-between py-4">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded bg-mintlify-accent/10"></div>
                <div>
                  <div className="h-4 w-32 bg-mintlify-accent/10 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-mintlify-accent/10 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-24 bg-mintlify-accent/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      <h3 className="text-lg font-semibold text-mintlify-text mb-6">General Settings</h3>
      <div className="divide-y divide-mintlify-accent/10">
        <SettingItem
          icon={<Globe className="h-5 w-5" />}
          title="Language"
          description="Select your preferred language"
        >
          <select className="bg-mintlify-hover/20 text-mintlify-text rounded-lg px-3 py-2 text-sm border border-mintlify-accent/10">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </SettingItem>

        <SettingItem
          icon={<Mail className="h-5 w-5" />}
          title="Email Notifications"
          description="Configure email notification preferences"
        >
          <button className="px-4 py-2 bg-mintlify-accent/10 hover:bg-mintlify-accent/20 
            text-mintlify-accent rounded-lg text-sm font-medium">
            Configure
          </button>
        </SettingItem>

        <SettingItem
          icon={<Bell className="h-5 w-5" />}
          title="Push Notifications"
          description="Manage push notification settings"
        >
          <button className="px-4 py-2 bg-mintlify-accent/10 hover:bg-mintlify-accent/20 
            text-mintlify-accent rounded-lg text-sm font-medium">
            Configure
          </button>
        </SettingItem>

        <SettingItem
          icon={<Moon className="h-5 w-5" />}
          title="Theme"
          description="Choose between light and dark theme"
        >
          <select className="bg-mintlify-hover/20 text-mintlify-text rounded-lg px-3 py-2 text-sm border border-mintlify-accent/10">
            <option>Dark</option>
            <option>Light</option>
            <option>System</option>
          </select>
        </SettingItem>
      </div>
    </div>
  );
} 