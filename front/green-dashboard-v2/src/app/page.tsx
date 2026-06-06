'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import authService from '@/features/auth/api/auth.api';
import { Loading } from '@/shared/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await authService.validateAuth();
      console.log('isAuthed', isAuthed);
      if (isAuthed) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className=" h-screen w-screen items-center justify-center">
      <Loading />
    </div>
  );
}


