import { api } from '@/shared/lib/axios';
import { ApiResponse } from '@/shared/types/api';
import Cookies from 'js-cookie';
import type { Admin, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

export type { Admin, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';


class AuthService {
  
  private readonly ADMIN_KEY = 'admin';
  private readonly SESSION_KEY = 'connect.sid';
  private loginPromise: Promise<AuthResponse> | null = null;

  constructor() {
    // Initialize auth state from localStorage only in browser environment
    if (typeof window !== 'undefined') {
      
    }
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }



  checkSession(): boolean {
    if (!this.isClient()) return false;
    const hasSession = !!Cookies.get(this.SESSION_KEY);
    const hasAdmin = !!localStorage.getItem(this.ADMIN_KEY);
    return hasSession && hasAdmin;
  }


  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/admin/register', credentials, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data?.data) {
        const { admin } = response.data.data;
        this.setAdmin(admin);
        return response.data.data;
      }



      
      throw new Error('Registration failed: Invalid response format');
    } catch (error: any) {
      this.clearAuth();
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.loginPromise) {
      return this.loginPromise;
    }

    this.loginPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await api.post<ApiResponse<AuthResponse>>('/admin/login', credentials, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.data?.data) {
          const { admin } = response.data.data;
          this.setAdmin(admin);
          resolve(response.data.data);
        } else {
          throw new Error('Login failed: Invalid response format');
        }



      } catch (error: any) {
        this.clearAuth();
        reject(error);
      } finally {
        this.loginPromise = null;
      }
    });

    return this.loginPromise;
  }

  

    

  async logout(): Promise<void> {
    try {
      await api.post('/admin/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async getProfile(): Promise<Admin> {
    try {
      const cachedAdmin = this.getAdmin();
      if (cachedAdmin) {
        return cachedAdmin;
      }

      const response = await api.get<ApiResponse<Admin>>('/admin/profile', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.data) {
        const admin = response.data.data;
        this.setAdmin(admin);
        return admin;
      }
      
      throw new Error('Failed to get profile: Invalid response format');
    } catch (error: any) {
      this.clearAuth();
      throw error;
    }
  }

  async checkSuperAdminExists(): Promise<boolean> {
    try {
      const response = await api.get<ApiResponse<{ exists: boolean }>>('/admin/check-super-admin', {
        withCredentials: true
      });
      return response.data?.data?.exists || false;
    } catch (error: any) {
      throw error;
    }
  }

  



  getAdmin(): Admin | null {
    if (!this.isClient()) return null;
    try {
      const adminStr = localStorage.getItem(this.ADMIN_KEY);
      return adminStr ? JSON.parse(adminStr) : null;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  setAdmin(admin: Admin): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
  }

  clearAuth(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.ADMIN_KEY);
    Cookies.remove(this.SESSION_KEY);
  }

  

  
  async validateAuth(): Promise<boolean> {
    try {
      if (!this.checkSession()) {
        return false;
      }

      const response = await api.get<ApiResponse<Admin>>('/admin/profile', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data?.data) {
        const admin = response.data.data;
        this.setAdmin(admin);
        return true;
      }
      return false;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }
}

export default new AuthService(); 