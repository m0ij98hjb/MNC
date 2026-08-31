'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { ConfirmProvider } from '@/context/ConfirmContext';
import { ROLES } from '@/lib/roleBasedAccess';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const { getDashboard, canAccessRoute, loading: roleLoading } = useRoleAccess();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (user === null && !isLoginPage) {
      router.replace('/admin/login');
      return;
    }
    
    // If authenticated and not on login page, check access and redirect if needed
    if (user && !isLoginPage && !roleLoading) {
      if (!canAccessRoute(pathname)) {
        // User doesn't have access to this route, redirect to their dashboard
        const dashboard = getDashboard();
        router.replace(dashboard);
      }
    }
  }, [user, isLoginPage, router, roleLoading, canAccessRoute, pathname, getDashboard]);

  // Login page: fixed overlay hides the root layout's Navbar/Footer/FloatingContact
  if (isLoginPage) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto">
        {children}
      </div>
    );
  }

  // Redirect in progress – hide UI for loading or role-based redirect.
  // Also blank out a route the role can't access so the wrong page never
  // paints before the redirect effect above swaps it for the right one.
  if (user === undefined || user === null || roleLoading || !canAccessRoute(pathname)) {
    return null;
  }

  // Authenticated: each page manages its own layout via AdminPageLayout
  return (
    <ConfirmProvider>
      <NotificationsProvider>{children}</NotificationsProvider>
    </ConfirmProvider>
  );
}
