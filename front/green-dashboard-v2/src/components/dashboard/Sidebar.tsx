'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  LogOut,
  UserCog,
  Bell,
  Tag
} from 'lucide-react';

export const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/dashboard/products' },
  { icon: Tag, label: 'Categories', href: '/dashboard/categories' },
  { icon: ShoppingCart, label: 'Orders', href: '/dashboard/orders' },
  { icon: Users, label: 'Customers', href: '/dashboard/customers' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: UserCog, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

function MenuItem({ icon: Icon, label, href }: typeof menuItems[0]) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href}
      className={`
        flex items-center px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'text-mintlify-accent bg-mintlify-accent/10 shadow-glow backdrop-blur-lg' 
          : 'text-mintlify-text-secondary  hover:bg-mintlify-hover/30 hover:text-mintlify-text '
        }
      `}
    >
      <Icon size={20} className={`mr-3 ${isActive ? 'text-mintlify-accent' : ''}`} />
      {label}
    </Link>
  );
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen, onLogout }) => {
  return (
    <aside 
      className={`
        fixed top-0 left-0 z-40 h-screen w-64 
        bg-mintlify-sidebar/30 backdrop-blur-2xl
        border- border-mintlify-accent/10
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        lg:relative
      `}
    >
      <div className="h-full px-3 py-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-mintlify-accent/10 backdrop-blur-xl flex items-center justify-center">
              <span className="text-mintlify-accent text-xl font-bold shadow-glow">G</span>
            </div>
            <h2 className="text-xl font-bold text-mintlify-text">
              Green
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-mintlify-text-secondary hover:text-mintlify-text"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 mt-6 text-mintlify-text-secondary 
            rounded-lg hover:bg-mintlify-hover/30 hover:text-mintlify-text 
            transition-all duration-200 backdrop-blur-sm"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>

        {/* Bottom accent glow */}
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-mintlify-accent/5 rounded-full blur-2xl pointer-events-none"
          style={{ transform: 'translate(-50%, 50%)' }}
        />
      </div>
    </aside>
  );
};

export default Sidebar;