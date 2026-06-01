'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/api/auth.api';
import { Loading } from '@/components/ui/Loading';

export default function HomePage() {
  const router = useRouter();
  

  useEffect(() => {
    if (true) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className=" h-screen w-screen items-center justify-center">
      <Loading />
    </div>
  );
}


