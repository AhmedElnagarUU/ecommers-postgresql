'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import authService from '@/api/auth.api';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      success(`Welcome back, ${response.admin.name}!`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login');
      showError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md p-8">
      <div className="bg-transparent backdrop-blur-2xl rounded-2xl relative overflow-hidden group">
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-mintlify-accent/10 via-mintlify-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-mintlify-accent/10 flex items-center justify-center">
                <LogIn className="w-10 h-10 text-mintlify-accent" />
              </div>
              <div className="absolute -inset-1 bg-mintlify-accent/20 rounded-2xl blur-lg -z-10"></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-mintlify-text mb-2">Welcome back</h2>
            <p className="text-mintlify-text-secondary">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-mintlify-text-secondary mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-mintlify-text-secondary group-hover:text-mintlify-accent transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50 
                      placeholder-mintlify-text-secondary/50 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-mintlify-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-mintlify-text-secondary group-hover:text-mintlify-accent transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50 
                      placeholder-mintlify-text-secondary/50 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3 px-4 bg-mintlify-accent hover:bg-mintlify-accent-dark 
                text-white font-medium rounded-lg transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed group
                hover:shadow-glow hover:shadow-mintlify-accent/50"
            >
              <span className={`${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign in
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* <div className="mt-6 text-center">
            <span className="text-mintlify-text-secondary">
              Don't have an account?{' '}
              <Link href="/register" className="text-mintlify-accent hover:text-mintlify-accent-dark transition-colors">
                Create account
              </Link>
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
} 