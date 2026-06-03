import React from 'react';
import { Boxes, MessageSquare, CreditCard, Share2 } from 'lucide-react';

interface IntegrationSettingsProps {
  loading?: boolean;
}

interface IntegrationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
}

function IntegrationItem({ icon, title, description, connected }: IntegrationItemProps) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex gap-3">
        <div className="mt-1">
          <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center text-mintlify-accent">
            {icon}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-mintlify-text">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              connected 
                ? 'bg-mintlify-accent/10 text-mintlify-accent'
                : 'bg-mintlify-hover/30 text-mintlify-text-secondary'
            }`}>
              {connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <p className="text-sm text-mintlify-text-secondary mt-1">{description}</p>
        </div>
      </div>
      <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
        connected
          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'bg-mintlify-accent/10 text-mintlify-accent hover:bg-mintlify-accent/20'
      }`}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

export function IntegrationSettings({ loading }: IntegrationSettingsProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 bg-mintlify-accent/10 rounded"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start justify-between py-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-mintlify-accent/10"></div>
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

  const integrations = [
    {
      icon: <Boxes className="h-5 w-5" />,
      title: "Inventory System",
      description: "Connect with external inventory management",
      connected: true
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Chat Integration",
      description: "Enable customer support chat system",
      connected: false
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payment Gateway",
      description: "Configure payment processing system",
      connected: true
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      title: "Social Media",
      description: "Connect with social media platforms",
      connected: false
    }
  ];

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-6">
      <h3 className="text-lg font-semibold text-mintlify-text mb-6">Integrations</h3>
      <div className="divide-y divide-mintlify-accent/10">
        {integrations.map((integration, index) => (
          <IntegrationItem key={index} {...integration} />
        ))}
      </div>
    </div>
  );
} 