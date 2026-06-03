'use client';

import React from 'react';
import { Order, OrderStatus } from '@/features/orders/api/order.api';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatVariantLabel } from '@/utils/variant.utils';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onStatusChange: (status: OrderStatus) => Promise<void>;
}

export function OrderDetails({ order, onBack, onStatusChange }: OrderDetailsProps) {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-400" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-mintlify-text-secondary" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-400';
      case 'delivered':
        return 'bg-green-500/10 text-green-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-mintlify-hover/30 text-mintlify-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
            hover:bg-mintlify-accent/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-mintlify-text">
          Order #{order.orderNumber}
        </h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="text-sm font-medium capitalize">{order.status}</span>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-6 border border-mintlify-accent/10">
          <h3 className="text-lg font-medium text-mintlify-text mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-mintlify-text-secondary">Name</p>
              <p className="text-mintlify-text">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-mintlify-text-secondary">Email</p>
              <p className="text-mintlify-text">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-mintlify-text-secondary">Phone</p>
              <p className="text-mintlify-text">{order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-6 border border-mintlify-accent/10">
          <h3 className="text-lg font-medium text-mintlify-text mb-4">Shipping Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-mintlify-text-secondary">Address</p>
              <p className="text-mintlify-text">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-6 border border-mintlify-accent/10">
        <h3 className="text-lg font-medium text-mintlify-text mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => {
            const itemName =
              'name' in item
                ? item.name
                : typeof item.product === 'object'
                  ? item.product?.name
                  : 'Product';
            const lineTotal =
              'total' in item ? item.total : item.price * item.quantity;
            const variantLabel = formatVariantLabel(item.selectedVariants);

            return (
            <div key={index} className="flex items-center justify-between py-3 border-b border-mintlify-accent/10 last:border-0">
              <div>
                <p className="text-mintlify-text">{itemName}</p>
                <p className="text-sm text-mintlify-text-secondary">
                  Quantity: {item.quantity}
                </p>
                {variantLabel && (
                  <p className="text-sm text-mintlify-accent mt-1">
                    Variants: {variantLabel}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-mintlify-text">${item.price.toFixed(2)}</p>
                <p className="text-sm text-mintlify-text-secondary">
                  Total: ${lineTotal.toFixed(2)}
                </p>
              </div>
            </div>
            );
          })}
          <div className="flex justify-between items-center pt-4 border-t border-mintlify-accent/10">
            <p className="text-lg font-medium text-mintlify-text">Total Amount</p>
            <p className="text-lg font-medium text-mintlify-text">${order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-6 border border-mintlify-accent/10">
        <h3 className="text-lg font-medium text-mintlify-text mb-4">Order Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <p className="text-mintlify-text capitalize">{order.status}</p>
              <p className="text-sm text-mintlify-text-secondary">
                {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-mintlify-accent/10 text-mintlify-accent">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-mintlify-text">Order Placed</p>
              <p className="text-sm text-mintlify-text-secondary">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}