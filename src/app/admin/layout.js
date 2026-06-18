'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (user === null && !isLoginPage) router.replace('/admin/login');
    if (user && user !== undefined && isLoginPage) router.replace('/admin/dashboard');
  }, [user, isLoginPage, router]);

  // Login page: fixed overlay hides the root layout's Navbar/Footer/FloatingContact
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto">
        {children}
      </div>
    );
  }

  // Redirect in progress
  if (user === undefined || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
      </div>
    );
  }

  // Authenticated: each page manages its own layout via AdminPageLayout
  return <>{children}</>;
}
