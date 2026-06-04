'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/shared/ui/Loading';
import authService, { Admin }  from '@/features/auth/api/auth.api';
import Sidebar from '@/shared/layout/Sidebar';
import { Header } from '@/shared/layout/Header';
import Cookies from 'js-cookie';
import { dashboardService, DashboardStats } from '@/features/dashboard/api/dashboard.api';

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

function MainContent({ children, dashboard, isSidebarOpen, setSidebarOpen }: {
  children: React.ReactNode;
  dashboard: DashboardStats;
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
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const isAuthed = await authService.validateAuth();
        if (!isAuthed) {
          router.push('/login');
          return;
        }
        const data = await dashboardService.getStats();
        setDashboard(data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          authService.clearAuth();
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setDashboard(null);
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mintlify-bg">
        <div className="text-center">
          <h2 className="text-xl font-bold text-mintlify-text">Unable to load dashboard data</h2>
          <p className="text-mintlify-text-secondary mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
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
          dashboard={dashboard}
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          {children}
        </MainContent>
      </div>
    </div>
  );
}