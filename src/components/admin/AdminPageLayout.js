'use client';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPageLayout({ children }) {
  const { isRTL } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--background)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="flex pt-[68px] min-h-screen">
        {!isRTL && <AdminSidebar />}
        <div className="flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
        {isRTL && <AdminSidebar />}
      </div>
    </div>
  );
}
