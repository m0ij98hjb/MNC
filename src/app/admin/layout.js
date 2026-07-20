'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import { ROLES } from '@/lib/purchasingConfig';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const { role: purchRole, loading: purchRoleLoading } = usePurchasingRole();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // A purchasing "site_engineer" account has no business in the admin shell —
  // it only ever uses the public /purchase-request portal.
  const isEngineerOnly = purchRole === ROLES.SITE_ENGINEER;

  useEffect(() => {
    if (user === null && !isLoginPage) router.replace('/admin/login');
    if (user && user !== undefined && isLoginPage && !purchRoleLoading && !isEngineerOnly) router.replace('/admin/dashboard');
    if (user && user !== undefined && !isLoginPage && !purchRoleLoading && isEngineerOnly) router.replace('/purchase-request');
  }, [user, isLoginPage, router, purchRoleLoading, isEngineerOnly]);

  // Login page: fixed overlay hides the root layout's Navbar/Footer/FloatingContact
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto">
        {children}
      </div>
    );
  }

  // Redirect in progress
  if (user === undefined || user === null || purchRoleLoading || isEngineerOnly) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
      </div>
    );
  }

  // Authenticated: each page manages its own layout via AdminPageLayout
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
