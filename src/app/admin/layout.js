'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (user === null && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [user, isLoginPage, router]);

  // Login page: show as-is (no sidebar)
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] overflow-auto">
        {children}
      </div>
    );
  }

  // Loading state
  if (user === undefined || user === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
      </div>
    );
  }

  // Authenticated admin layout
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0d0d0d] flex overflow-hidden" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
