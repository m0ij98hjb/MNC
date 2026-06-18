'use client';
import Navbar from '@/components/layout/Navbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPageLayout({ children }) {
  const { isRTL } = useLanguage();
  return (
    // dir on the wrapper is inherited by the flex container inside.
    // With dir="rtl", flex items flow right-to-left, so the first child (AdminSidebar)
    // naturally appears on the RIGHT — no conditional rendering needed.
    <div className="min-h-screen bg-[var(--background)]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <div className="flex pt-[92px] min-h-screen">
        <AdminSidebar />
        <div className="flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
