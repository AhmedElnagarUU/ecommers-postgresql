import React from 'react';
import { Lock, Shield, Smartphone, Key } from 'lucide-react';

interface SecuritySettingsProps {
  loading?: boolean;
}

interface SecurityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  action: string;
}

function SecurityItem({ icon, title, description, status, action }: SecurityItemProps) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex gap-3">
        <div className="mt-1 text-mintlify-text-secondary">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-mintlify-text">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              status === 'Enabled' 
                ? 'bg-mintlify-accent/10 text-mintlify-accent'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-mintlify-text-secondary mt-1">{description}</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-mintlify-accent/10 hover:bg-mintlify-accent/20 
        text-mintlify-accent rounded-lg text-sm font-medium">
        {action}
      </button>
    </div>
  );
}

export function SecuritySettings({ loading }: SecuritySettingsProps) {
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

  const securityItems = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Password",
      description: "Last changed 3 months ago",
      status: "Enabled",
      action: "Change"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      status: "Disabled",
      action: "Enable"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Device Management",
      description: "Manage devices that can access your account",
      status: "Enabled",
      action: "Manage"
    },
    {
      icon: <Key className="h-5 w-5" />,
      title: "API Keys",
      description: "Manage API keys for external integrations",
      status: "Enabled",
      action: "Manage"
    }
  ];

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      <h3 className="text-lg font-semibold text-mintlify-text mb-6">Security Settings</h3>
      <div className="divide-y divide-mintlify-accent/10">
        {securityItems.map((item, index) => (
          <SecurityItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
} 