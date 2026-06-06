'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Loading } from '@/shared/ui/Loading';
import authService from '@/features/auth/api/auth.api';
import Sidebar from '@/shared/layout/Sidebar';
import { Header } from '@/shared/layout/Header';

function BackgroundEffects() {
  return (
    <>
      {/* Top center glow */}
      <div 
        className="fixed top-0 left-1/2 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none" 
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Bottom right glow */}
      <div 
        className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-mintlify-accent/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(50%, 50%)' }}
      />
      {/* Left center accent glow */}
      <div 
        className="fixed top-1/2 left-0 w-[600px] h-[600px] bg-mintlify-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate(-30%, -50%)' }}
      />
    </>
  );
}

function MainContent({ children, isSidebarOpen, setSidebarOpen }: {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const admin = authService.getAdmin();
  const displayName = admin?.name || 'Admin';

  return (
    <div className="flex-1 min-h-screen relative">
      <Header 
        adminName={displayName}
        isMobile={true}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <main className="p-4 lg:p-8 pb-0">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-mintlify-text">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="mt-2 text-mintlify-text-secondary">
              Here's what's happening with your store today.
            </p>
          </div>

          {/* Content Container */}
          <div className="relative">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateDashboardAccess = async () => {
      try {
        setIsLoading(true);
        const isAuthed = await authService.validateAuth();
        console.log('isAuthed', isAuthed);
        if (!isAuthed) {
          console.log('redirecting to login');
          // Use replace instead of push to ensure redirect
          router.push('/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error: any) {
        if (error.response?.status === 401) {
          authService.clearAuth();
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateDashboardAccess();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthorized(false);
      redirect('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading || !isAuthorized) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-mintlify-bg text-mintlify-text">
      <BackgroundEffects />
      
      <div className="flex w-full">
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        
        <MainContent 
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          {children}
        </MainContent>
      </div>
    </div>
  );
}