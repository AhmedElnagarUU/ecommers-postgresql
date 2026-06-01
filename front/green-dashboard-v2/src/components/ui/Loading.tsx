'use client';

import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="min-h-screen bg-mintlify-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(50%, 50%)' }}
      />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-30%, 30%)' }}
      />
      
      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-mintlify-accent/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-mintlify-accent animate-spin" />
          </div>
          <div className="absolute -inset-1 bg-mintlify-accent/10 blur-lg rounded-xl"></div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-mintlify-text">Loading</h3>
          <p className="text-mintlify-text-secondary">Please wait while we fetch your data...</p>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'default', className = '' }: { size?: 'sm' | 'default' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} rounded-lg bg-mintlify-accent/10 flex items-center justify-center`}>
        <Loader2 className={`${sizeClasses[size]} text-mintlify-accent animate-spin`} />
      </div>
      <div className="absolute -inset-1 bg-mintlify-accent/10 blur-lg rounded-lg"></div>
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-mintlify-bg/80 backdrop-blur-sm flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="relative min-h-screen h-full w-full flex items-center justify-center bg-[#030303] overflow-hidden">
      {/* Blur circles */}
      <div 
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl" 
        style={{ transform: 'translate(50%, 50%)' }}
      />
      
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex space-x-3">
          <div className="h-6 w-6 animate-bounce rounded-full bg-gradient-to-r from-purple-600 to-pink-600 [animation-delay:-0.3s]" />
          <div className="h-6 w-6 animate-bounce rounded-full bg-gradient-to-r from-purple-600 to-pink-600 [animation-delay:-0.15s]" />
          <div className="h-6 w-6 animate-bounce rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">
            Loading
          </h3>
          <p className="mt-2 text-base text-white/60">
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
} 