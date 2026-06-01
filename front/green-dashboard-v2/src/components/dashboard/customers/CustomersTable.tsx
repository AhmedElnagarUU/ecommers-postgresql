import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
}

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="bg-mintlify-card/20 backdrop-blur-xl rounded-2xl border border-mintlify-accent/10">
      <div className="relative overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mintlify-accent/10">
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Orders
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-mintlify-text-secondary">
                Total Spent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mintlify-accent/10">
            {customers.map((customer) => (
              <tr key={customer._id} 
                className="hover:bg-mintlify-hover/20">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
                      <span className="text-mintlify-accent font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-mintlify-text">
                        {customer.name}
                      </div>
                      <div className="text-xs text-mintlify-text-secondary">
                        {customer._id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-mintlify-text-secondary">
                      <Mail size={14} className="mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-mintlify-text-secondary">
                      <Phone size={14} className="mr-2" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-mintlify-text-secondary">
                    <MapPin size={14} className="mr-2" />
                    {customer.location}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex rounded-lg px-3 py-1 text-xs font-medium 
                    bg-mintlify-accent/10 text-mintlify-accent">
                    {customer.totalOrders} orders
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-mintlify-text">
                  ${customer.totalSpent.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 