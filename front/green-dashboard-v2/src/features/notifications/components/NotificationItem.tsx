import React from 'react';
import { Bell, ShoppingCart, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: {
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
  };
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'order_placed':
        return <ShoppingCart className="w-5 h-5 text-mintlify-accent" />;
      case 'order_status_changed':
        return <Package className="w-5 h-5 text-blue-400" />;
      case 'shipping_status_changed':
        return <Truck className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-mintlify-text-secondary" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      className={`p-4 border-b border-mintlify-accent/10 hover:bg-mintlify-hover/20 
        transition-colors duration-200 ${!notification.read ? 'bg-mintlify-accent/5' : ''}`}
      onClick={() => onMarkAsRead(notification._id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-mintlify-text">
              {notification.title}
            </h3>
            <span className="text-xs text-mintlify-text-secondary">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm text-mintlify-text-secondary">
            {notification.message}
          </p>
          {notification.data.orderNumber && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-mintlify-text-secondary">
              <span>Order #{notification.data.orderNumber}</span>
              {notification.data.newStatus && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(notification.data.newStatus)}
                    <span>{notification.data.newStatus}</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 