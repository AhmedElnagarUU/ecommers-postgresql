import React from 'react';
import { Bell, CheckAll } from 'lucide-react';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Array<{
    _id: string;
    type: 'order_placed' | 'order_status_changed' | 'shipping_status_changed';
    title: string;
    message: string;
    data: {
      orderId?: string;
      orderNumber?: string;
      oldStatus?: string;
      newStatus?: string;
      customerName?: string;
      customerEmail?: string;
    };
    read: boolean;
    createdAt: string;
  }>;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  unreadCount
}: NotificationListProps) {
  return (
    <div className="w-full max-w-md bg-mintlify-card/20 backdrop-blur-xl rounded-lg 
      border border-mintlify-accent/10 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-mintlify-accent/10">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-mintlify-accent" />
          <h2 className="text-lg font-medium text-mintlify-text">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full 
              bg-mintlify-accent/10 text-mintlify-accent">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-1 text-sm text-mintlify-text-secondary 
              hover:text-mintlify-text transition-colors"
          >
            <CheckAll className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <div className="p-4 text-center text-mintlify-text-secondary">
            No notifications
          </div>
        )}
      </div>
    </div>
  );
} 