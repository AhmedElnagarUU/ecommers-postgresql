'use client';

import React from 'react';
// import { useAuth } from '../../hooks/useAuth'; // Create this hook
import AuthService from '@/api/auth.api';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  adminName: string;
  isMobile?: boolean;
  onMenuClick?: () => void;
}

function MobileHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="lg:hidden flex items-center p-4 bg-mintlify-sidebar/80 backdrop-blur-xl">
      <button
        onClick={onMenuClick}
        className="text-mintlify-text-secondary hover:text-mintlify-text mr-4 transition-colors"
      >
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-mintlify-text">
        Admin Dashboard
      </h1>
    </div>
  );
}

function DesktopHeader({ adminName }: { adminName: string }) {
  const admin = AuthService.getAdmin();
  const displayName = admin?.name || adminName;

  return (
    <header className="hidden lg:block bg-mintlify-sidebar/80 backdrop-blur-xl">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left side - Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-mintlify-text-secondary group-hover:text-mintlify-accent transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 rounded-lg
                bg-mintlify-hover/50 backdrop-blur-xl
                text-mintlify-text placeholder-mintlify-text-secondary
                focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50
                transition-all duration-200"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-mintlify-hover/50 text-mintlify-text-secondary hover:text-mintlify-accent transition-all duration-200 group">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-mintlify-accent shadow-glow"></span>
          </button>

          {/* Admin Name */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-mintlify-accent/10 flex items-center justify-center">
              <span className="text-mintlify-accent font-bold shadow-glow">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-mintlify-text font-medium">
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Header({ adminName, isMobile = false, onMenuClick }: HeaderProps) {
  if (isMobile) {
    return <MobileHeader onMenuClick={onMenuClick} />;
  }
  return <DesktopHeader adminName={adminName} />;
} 