'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin-s4u-dashboard') || pathname?.startsWith('/admin-s4u-login');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

