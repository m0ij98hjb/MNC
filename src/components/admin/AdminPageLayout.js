'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPageLayout({ children }) {
  const { isRTL } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="flex pt-[92px] min-h-screen">
        <AdminSidebar />
        <div className="flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
      <AdminBottomNav />
    </div>
  );
}
