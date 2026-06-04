'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/features/orders/api/order.api';
import { Search, ChevronDown, Eye, MoreVertical } from 'lucide-react';
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal';

interface OrdersListProps {
  orders: Order[];
  onView: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
  onDelete: (orderId: string) => Promise<void>;
  isLoading?: boolean;
}

export function OrdersList({ orders, onView, onStatusChange, onDelete, isLoading }: OrdersListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      await onDelete(orderToDelete._id);
      setDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/10 text-blue-400';
      case 'completed':
        return 'bg-green-500/10 text-green-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-mintlify-hover/30 text-mintlify-text-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-mintlify-hover/30 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mintlify-text-secondary" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="appearance-none pl-4 pr-10 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mintlify-text-secondary w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-mintlify-card/20 backdrop-blur-xl rounded-lg p-4 
              border border-mintlify-accent/10 hover:border-mintlify-accent/20
              transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-mintlify-text">
                    Order #{order.orderNumber}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-mintlify-text-secondary">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-sm text-mintlify-text-secondary">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-mintlify-text-secondary">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onView(order)}
                  className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                    hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button
                    className="p-2 text-mintlify-text-secondary hover:text-mintlify-accent 
                      hover:bg-mintlify-accent/10 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-mintlify-card/20 backdrop-blur-xl rounded-lg 
                    border border-mintlify-accent/10 shadow-lg z-10 hidden group-hover:block">
                    <div className="py-1">
                      {statusOptions
                        .filter((option) => option.value !== 'all' && option.value !== order.status)
                        .map((option) => (
                          <button
                            key={option.value}
                            onClick={() => onStatusChange(order._id, option.value as OrderStatus)}
                            className="w-full px-4 py-2 text-left text-sm text-mintlify-text-secondary 
                              hover:bg-mintlify-hover/20 hover:text-mintlify-text"
                          >
                            Change to {option.label}
                          </button>
                        ))}
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 
                          hover:bg-red-500/10"
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-mintlify-text-secondary">No orders found</p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?.orderNumber}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
