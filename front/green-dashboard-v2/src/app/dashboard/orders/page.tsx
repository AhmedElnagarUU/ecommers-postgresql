'use client';

import { useState, useEffect } from 'react';
import { OrdersList } from '@/components/dashboard/orders/OrdersList';
import { OrderDetails } from '@/components/dashboard/orders/OrderDetails';
import { Order, ordersService } from '@/api/order.api';
import { useToast } from '@/hooks/useToast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      console.log('const loadorders')
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
      error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await ordersService.updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      success('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      error('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersService.deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
      success('Order deleted successfully');
    } catch (err) {
      console.error('Error deleting order:', err);
      error('Failed to delete order');
    }
  };

  return (
    <div className="min-h-screen bg-mintlify-bg p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-mintlify-text">Orders</h1>
        <p className="text-mintlify-text-secondary">
          Manage and track all your customer orders
        </p>
      </div>

      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/2 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Content */}
      <div className="relative">
        {selectedOrder ? (
          <OrderDetails
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
            onStatusChange={(status) => handleStatusChange(selectedOrder._id, status)}
          />
        ) : (
          <OrdersList
            orders={orders}
            onView={handleViewOrder}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteOrder}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
} 