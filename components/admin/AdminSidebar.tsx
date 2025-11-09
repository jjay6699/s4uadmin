'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import Image from 'next/image';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, admin } = useAdmin();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', href: '/admin-s4u-dashboard', icon: '📊' },
    { label: 'Products', href: '/admin-s4u-dashboard/products', icon: '📦' },
    { label: 'Product Categories', href: '/admin-s4u-dashboard/categories', icon: '📂' },
    { label: 'Orders', href: '/admin-s4u-dashboard/orders', icon: '🛒' },
    { label: 'Payment Methods', href: '/admin-s4u-dashboard/payment-methods', icon: '💳' },
    { label: 'Users', href: '/admin-s4u-dashboard/users', icon: '👥' },
    { label: 'Analytics', href: '/admin-s4u-dashboard/analytics', icon: '📈' },
    { label: 'SEO Settings', href: '/admin-s4u-dashboard/seo', icon: '🔍' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin-s4u-login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Image src="/logo.webp" alt="Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="font-semibold text-sm text-gray-900">S4U Admin</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 text-xs"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        {isOpen && (
          <div className="text-xs text-gray-600 px-1">
            <p className="font-medium text-gray-900 text-xs">{admin?.name}</p>
            <p className="truncate text-gray-500 text-xs">{admin?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-md text-xs font-medium transition-colors"
        >
          {isOpen ? 'Logout' : '🚪'}
        </button>
      </div>
    </div>
  );
};

