'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setUnauthorizedHandler } from '@/lib/api';
import { storeApi } from '@/lib/services';
import type { Customer } from '@/lib/types';

interface AuthContextValue {
  customer: Customer | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const clearStoredAuth = () => {
      setToken(null);
      setCustomer(null);
      setAuthToken(null);
      localStorage.removeItem('store_token');
      localStorage.removeItem('store_customer');
    };

    setUnauthorizedHandler(clearStoredAuth);
    const saved = localStorage.getItem('store_token');
    const savedCustomer = localStorage.getItem('store_customer');

    const hydrate = async () => {
      if (!saved) {
        if (mounted) setIsLoading(false);
        return;
      }

      setToken(saved);
      setAuthToken(saved);
      if (savedCustomer) {
        try {
          setCustomer(JSON.parse(savedCustomer));
        } catch {
          localStorage.removeItem('store_customer');
        }
      }

      try {
        const freshCustomer = await storeApi.getMe();
        if (!mounted) return;
        setCustomer(freshCustomer);
        localStorage.setItem('store_customer', JSON.stringify(freshCustomer));
      } catch {
        clearStoredAuth();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void hydrate();

    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
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

  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const result = await storeApi.updateProfile(data);
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
    <AuthContext.Provider value={{ customer, token, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
