import React from 'react';
import { Bell, ShoppingCart, UserPlus, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'alert' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #12345 has been placed',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'user',
    title: 'New User Registration',
    message: 'John Doe has created an account',
    time: '1 hour ago',
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Product "Wireless Headphones" is running low',
    time: '2 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    time: '3 hours ago',
    read: true
  }
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return ShoppingCart;
    case 'user':
      return UserPlus;
    case 'alert':
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getIconColor = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return 'text-mintlify-accent';
    case 'user':
      return 'text-blue-400';
    case 'alert':
      return 'text-yellow-400';
    default:
      return 'text-mintlify-text-secondary';
  }
};

interface NotificationsListProps {
  loading?: boolean;
}

export function NotificationsList({ loading }: NotificationsListProps) {
  if (loading) {
    return (
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
        <div className="divide-y divide-mintlify-accent/10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="animate-pulse flex space-x-4">
                <div className="h-10 w-10 bg-mintlify-accent/10 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-mintlify-accent/10 rounded w-1/4"></div>
                  <div className="h-3 bg-mintlify-accent/10 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
      <div className="divide-y divide-mintlify-accent/10">
        {sampleNotifications.map((notification) => {
          const Icon = getIcon(notification.type);
          const iconColor = getIconColor(notification.type);
          
          return (
            <div key={notification.id} 
              className={`p-4 hover:bg-mintlify-hover/20 ${!notification.read ? 'bg-mintlify-hover/10' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`h-10 w-10 rounded-lg bg-mintlify-accent/10 flex items-center justify-center ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-mintlify-text">
                    {notification.title}
                  </p>
                  <p className="text-sm text-mintlify-text-secondary">
                    {notification.message}
                  </p>
                  <p className="text-xs text-mintlify-text-secondary mt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-mintlify-accent"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 