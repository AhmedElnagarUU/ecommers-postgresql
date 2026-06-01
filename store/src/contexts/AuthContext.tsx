'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '@/lib/api';
import { storeApi } from '@/lib/services';
import type { Customer } from '@/lib/types';

interface AuthContextValue {
  customer: Customer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('store_token');
    const savedCustomer = localStorage.getItem('store_customer');
    if (saved) {
      setToken(saved);
      setAuthToken(saved);
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
    }
    setIsLoading(false);
  }, []);

  const persist = (newToken: string, newCustomer: Customer) => {
    setToken(newToken);
    setCustomer(newCustomer);
    setAuthToken(newToken);
    localStorage.setItem('store_token', newToken);
    localStorage.setItem('store_customer', JSON.stringify(newCustomer));
  };

  const login = async (email: string, password: string) => {
    const result = await storeApi.login({ email, password });
    persist(result.token, result.customer);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const result = await storeApi.register(data);
    persist(result.token, result.customer);
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    setAuthToken(null);
    localStorage.removeItem('store_token');
    localStorage.removeItem('store_customer');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
