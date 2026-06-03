import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart2,
  Settings,
  UserCog,
  Bell,
  Tag,
  LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const menuItems: MenuItem[] = [
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
