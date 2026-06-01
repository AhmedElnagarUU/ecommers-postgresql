import React from 'react';
import { Bell, ShoppingCart, UserPlus, AlertTriangle } from 'lucide-react';

const filters = [
  { label: 'All', icon: Bell, count: 12 },
  { label: 'Orders', icon: ShoppingCart, count: 5 },
  { label: 'Users', icon: UserPlus, count: 3 },
  { label: 'Alerts', icon: AlertTriangle, count: 4 }
];

export function NotificationsFilter() {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10 p-4">
      <div className="flex flex-wrap gap-4">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg 
              bg-mintlify-hover/20 hover:bg-mintlify-hover/30
              text-mintlify-text-secondary hover:text-mintlify-text"
          >
            <filter.icon className="h-4 w-4" />
            <span className="text-sm">{filter.label}</span>
            <span className="text-xs bg-mintlify-accent/10 text-mintlify-accent px-2 py-0.5 rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 