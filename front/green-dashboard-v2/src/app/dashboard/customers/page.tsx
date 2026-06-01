'use client';

import { useState } from 'react';
import { CustomersTable } from '@/components/dashboard/customers/CustomersTable';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    {
      _id: 'CUS001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8901',
      location: 'New York, USA',
      totalOrders: 12,
      totalSpent: 2499.99
    },
    {
      _id: 'CUS002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234-567-8902',
      location: 'Los Angeles, USA',
      totalOrders: 8,
      totalSpent: 1799.50
    },
    {
      _id: 'CUS003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 234-567-8903',
      location: 'Chicago, USA',
      totalOrders: 15,
      totalSpent: 3299.99
    }
  ]);

  return (
    <div className="min-h-screen bg-mintlify-bg p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-mintlify-text">Customers</h1>
        <p className="text-mintlify-text-secondary">
          Manage and view all your customer information
        </p>
      </div>

      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/2 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Content */}
      <div className="relative">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
} 