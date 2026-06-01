'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { LocaleProvider } from '@/contexts/LocaleContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
