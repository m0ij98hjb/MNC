'use client';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { useLanguage } from '@/context/LanguageContext';
import { PenSquare } from 'lucide-react';
import dynamic from 'next/dynamic';

const JobsTab = dynamic(() => import('@/components/admin/content/JobsTab'), { ssr: false });

export default function JobPostingsPage() {
  const { t, isRTL } = useLanguage();

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center">
            <PenSquare size={16} className="text-[#c8a96e]" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('admin.jobPostingsMenu')}</h1>
        </div>
        <JobsTab />
      </div>
    </AdminPageLayout>
  );
}
