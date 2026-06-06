'use client';

import { useEffect, useState } from 'react';
import { customersService, type DashboardCustomer } from '@/features/customers/api/customer.api';
import { CustomersTable } from '@/features/customers/components/CustomersTable';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<DashboardCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    customersService
      .getCustomers()
      .then((data) => {
        if (!mounted) return;
        setCustomers(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        const message = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message;
        setError(message || 'Unable to load customers');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
        {isLoading ? (
          <div className="rounded-2xl border border-mintlify-accent/10 bg-mintlify-card/20 p-8 text-mintlify-text-secondary">
            Loading customers...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
            {error}
          </div>
        ) : (
          <CustomersTable customers={customers} />
        )}
      </div>
    </div>
  );
} 