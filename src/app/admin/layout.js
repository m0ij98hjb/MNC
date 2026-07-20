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
  const isSupervisorOnly = purchRole === ROLES.SITE_SUPERVISOR;
  // A purchasing "site_engineer" account has no business in the admin shell —
  // it only ever uses the public /purchase-request portal.
  // A "site_supervisor" also should be sent to the purchase request portal.
  const isEngineerOnly = purchRole === ROLES.SITE_ENGINEER;

  useEffect(() => {
    if (user === null && !isLoginPage) {
      router.replace('/admin/login');
      return;
    }
    // If authenticated and not on login page, redirect based on role
    if (user && !isLoginPage && !purchRoleLoading) {
      if (!isEngineerOnly && !isSupervisorOnly) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/purchase-request');
      }
      return;
    }
  }, [user, isLoginPage, router, purchRoleLoading, isEngineerOnly, isSupervisorOnly]);

  // Login page: fixed overlay hides the root layout's Navbar/Footer/FloatingContact
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto">
        {children}
      </div>
    );
  }

  // Redirect in progress – hide UI for loading or role-based redirect
  if (user === undefined || user === null || purchRoleLoading || isEngineerOnly || isSupervisorOnly) {
    return null;
  }

  // Authenticated: each page manages its own layout via AdminPageLayout
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
