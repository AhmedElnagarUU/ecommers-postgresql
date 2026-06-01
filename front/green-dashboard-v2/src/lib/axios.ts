import axios, { 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';
import authService from '@/api/auth.api';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

console.log('API URL:', baseURL); // Debug log

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Always true for session cookies
  timeout: 10000
});

// Add a request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Skip auth check for login/register routes
    if (config.url?.includes('/auth/')) {
      return config;
    }

    // Check if session exists
    // if (!authService.checkSession()) {
    //   // Redirect to login if no session
    //   if (typeof window !== 'undefined') {
    //     window.location.href = '/login';
    //   }
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest.url?.includes('/auth/')) {
      // Clear auth and redirect to login
      authService.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    throw error;
  }
);

// Export types for API responses
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[] | Record<string, string[]>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = {
  data: ApiSuccessResponse<T> | ApiErrorResponse;
}; 