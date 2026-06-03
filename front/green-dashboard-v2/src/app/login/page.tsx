'use client';

import { LoginForm } from '@/features/auth/components/LoginForm';
import AuthService from '@/features/auth/api/auth.api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const router = useRouter();
  // useEffect(() => {
  //   AuthService.checkSuperAdminExists().then((exists) => {
  //     if (!exists) {
  //       router.push('/register');
  //     }
  //   });
  // }, []);
  return (
    <div className="min-h-screen bg-mintlify-bg flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(50%, 50%)' }}
      />
      {/* Center-top accent glow */}
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      <LoginForm />
    </div>
  );
} 