import React from 'react';
import { Bell, Lock, Eye, Moon, Globe } from 'lucide-react';

interface ProfileSettingsProps {
  loading?: boolean;
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function SettingItem({ icon, title, description, enabled, onToggle }: SettingItemProps) {
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
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-mintlify-accent' : 'bg-mintlify-accent/10'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export function ProfileSettings({ loading }: ProfileSettingsProps) {
  const [settings, setSettings] = React.useState({
    notifications: true,
    privacy: false,
    darkMode: true,
    language: false,
  });

  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start justify-between py-4">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded bg-mintlify-accent/10"></div>
                <div>
                  <div className="h-4 w-32 bg-mintlify-accent/10 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-mintlify-accent/10 rounded"></div>
                </div>
              </div>
              <div className="h-6 w-11 rounded-full bg-mintlify-accent/10"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      <div className="divide-y divide-mintlify-accent/10">
        <SettingItem
          icon={<Bell className="h-5 w-5" />}
          title="Notifications"
          description="Receive notifications about important updates"
          enabled={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        <SettingItem
          icon={<Lock className="h-5 w-5" />}
          title="Privacy Mode"
          description="Hide sensitive information from others"
          enabled={settings.privacy}
          onToggle={() => toggleSetting('privacy')}
        />
        <SettingItem
          icon={<Moon className="h-5 w-5" />}
          title="Dark Mode"
          description="Switch between light and dark themes"
          enabled={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        <SettingItem
          icon={<Globe className="h-5 w-5" />}
          title="Language"
          description="Change the interface language"
          enabled={settings.language}
          onToggle={() => toggleSetting('language')}
        />
      </div>
    </div>
  );
} 