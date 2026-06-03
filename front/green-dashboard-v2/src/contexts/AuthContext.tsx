'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService, { Admin, AuthResponse } from '@/features/auth/api/auth.api';

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  adminExists: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAdminExists: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const router = useRouter();

  const checkAdminExists = async () => {
    try {
      const exists = await authService.checkSuperAdminExists();
      setAdminExists(exists);
    } catch (error) {
      console.error('Failed to check admin existence:', error);
      setAdminExists(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const admin = await authService.getAdmin();
        setAdmin(admin);
        if (admin && window.location.pathname === '/login') {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    checkAdminExists();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { admin } = await authService.login({ email, password });
      
      if (admin.role !== 'admin' && admin.role !== 'super_admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      setAdmin(admin);
      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { admin } = await authService.register({
        name,
        email,
        password,
        role: 'super_admin'
      });
      setAdmin(admin);
      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setAdmin(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    admin: admin || authService.getAdmin(),
    loading,
    adminExists,
    login,
    register,
    logout,
    checkAdminExists,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 