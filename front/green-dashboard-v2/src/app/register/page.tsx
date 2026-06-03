'use client';

import { RegisterForm } from '@/features/auth/components/RegisterForm';
import AuthService from '@/features/auth/api/auth.api';
import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function RegisterPage() {
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkSuperAdminExists = async () => {
      const exists = await AuthService.checkSuperAdminExists();
      setSuperAdminExists(exists);
    };
    checkSuperAdminExists();
  }, []);
  if (superAdminExists) {
    return (
    <div className="min-h-screen bg-mintlify-bg flex flex-col items-center justify-center gap-4">
      <p className="text-xl text-red-500 font-bold">You can't register admins</p>
      <Link 
        href="/login" 
        className="text-mintlify-accent hover:underline"
      >
        Back to login
      </Link>
    </div>
    );
  }
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

      <RegisterForm />
    </div>
  );
} 