import React from 'react';

interface Order {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mintlify-accent/10">
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/10">
            {orders.map((order) => (
              <tr key={order._id} 
                className="hover:bg-mintlify-hover/20">
                <td className="px-6 py-4 text-sm font-medium text-mintlify-text">
                  {order._id}
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${
                      order.status === 'completed'
                        ? 'bg-mintlify-accent/10 text-mintlify-accent'
                        : order.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-mintlify-hover/30 text-mintlify-text-secondary'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-mintlify-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 