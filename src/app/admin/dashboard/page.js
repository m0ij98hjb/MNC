'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import {
  Users, Clock, CheckCircle, XCircle, TrendingUp,
  Briefcase, Building2, ArrowLeft, ArrowRight, CalendarCheck,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Link from 'next/link';

const JOB_STATUS_CFG = {
  pending:             { color: '#3b82f6', label: 'جديد' },
  interview_scheduled: { color: '#f59e0b', label: 'مقابلة محددة' },
  rejected:            { color: '#ef4444', label: 'مرفوض' },
};

function StatCard({ label, value, icon: Icon, color, bg, href }) {
  const inner = (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.13] transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardPage() {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [supplierCounts, setSupplierCounts] = useState({ total: 0, new: 0, under_review: 0, approved: 0, rejected: 0 });
  const [jobCounts, setJobCounts]           = useState({ total: 0, pending: 0, interview_scheduled: 0, rejected: 0 });
  const [recentSuppliers, setRecentSuppliers] = useState([]);
  const [recentJobs, setRecentJobs]           = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const c = { total: docs.length, new: 0, under_review: 0, approved: 0, rejected: 0 };
      docs.forEach(d => { if (c[d.status] !== undefined) c[d.status]++; });
      setSupplierCounts(c);
      setRecentSuppliers(
        [...docs].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)).slice(0, 6)
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobApplications'), snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const c = { total: docs.length, pending: 0, interview_scheduled: 0, rejected: 0 };
      docs.forEach(d => { if (c[d.status] !== undefined) c[d.status]++; });
      setJobCounts(c);
      setRecentJobs(
        [...docs].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)).slice(0, 6)
      );
    });
    return unsub;
  }, []);

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{t('admin.dashboard')}</h1>
        </div>

        {/* ── Suppliers Stats ── */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">إحصائيات الموردين</span>
            <Link href="/admin/suppliers" className="ms-auto text-xs text-[#c8a96e] hover:underline flex items-center gap-1">
              عرض الكل <ArrowIcon size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
            <StatCard label={t('admin.total')}       value={supplierCounts.total}        icon={Users}       color="#a78bfa" bg="rgba(167,139,250,0.12)" href="/admin/suppliers" />
            <StatCard label={t('admin.new')}         value={supplierCounts.new}          icon={TrendingUp}  color="#3b82f6" bg="rgba(59,130,246,0.12)"   href="/admin/suppliers" />
            <StatCard label={t('admin.underReview')} value={supplierCounts.under_review} icon={Clock}       color="#f59e0b" bg="rgba(245,158,11,0.12)"   href="/admin/suppliers" />
            <StatCard label={t('admin.approved')}    value={supplierCounts.approved}     icon={CheckCircle} color="#10b981" bg="rgba(16,185,129,0.12)"   href="/admin/approved" />
            <StatCard label={t('admin.rejected')}    value={supplierCounts.rejected}     icon={XCircle}     color="#ef4444" bg="rgba(239,68,68,0.12)"    href="/admin/suppliers" />
          </div>
        </div>

        {/* ── Jobs Stats ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase size={14} className="text-[#c8a96e]" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">إحصائيات الوظائف</span>
            <Link href="/admin/jobs" className="ms-auto text-xs text-[#c8a96e] hover:underline flex items-center gap-1">
              عرض الكل <ArrowIcon size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="إجمالي الطلبات"   value={jobCounts.total}                icon={Users}        color="#a78bfa" bg="rgba(167,139,250,0.12)" href="/admin/jobs" />
            <StatCard label="طلبات جديدة"       value={jobCounts.pending}              icon={TrendingUp}   color="#3b82f6" bg="rgba(59,130,246,0.12)"  href="/admin/jobs" />
            <StatCard label="مقابلات محددة"     value={jobCounts.interview_scheduled}  icon={CalendarCheck} color="#f59e0b" bg="rgba(245,158,11,0.12)"  href="/admin/jobs/approved" />
            <StatCard label="مرفوضة"            value={jobCounts.rejected}             icon={XCircle}      color="#ef4444" bg="rgba(239,68,68,0.12)"   href="/admin/jobs" />
          </div>
        </div>

        {/* ── Recent records — two halves ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Suppliers */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
                  <Building2 size={13} className="text-blue-400" />
                </div>
                <h2 className="text-sm font-semibold text-white">آخر طلبات الموردين</h2>
              </div>
              <Link href="/admin/suppliers" className="flex items-center gap-1 text-xs text-[#c8a96e] hover:underline">
                {t('admin.viewAll')} <ArrowIcon size={11} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {recentSuppliers.length === 0 ? (
                <p className="text-center text-white/25 text-sm py-8">{t('admin.noSuppliers')}</p>
              ) : recentSuppliers.map(s => (
                <Link
                  key={s.id}
                  href={`/admin/suppliers/${s.id}`}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate group-hover:text-[#c8a96e] transition-colors">{s.companyName}</p>
                    <p className="text-xs text-white/30 mt-0.5 truncate">{s.city}{s.country ? `, ${s.country}` : ''} · {s.activity || '—'}</p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ms-3">
                    <StatusBadge status={s.status} />
                    <span className="text-[10px] text-white/20 hidden sm:block" dir="ltr">
                      {s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#c8a96e]/12 border border-[#c8a96e]/20 flex items-center justify-center">
                  <Briefcase size={13} className="text-[#c8a96e]" />
                </div>
                <h2 className="text-sm font-semibold text-white">آخر طلبات التوظيف</h2>
              </div>
              <Link href="/admin/jobs" className="flex items-center gap-1 text-xs text-[#c8a96e] hover:underline">
                {t('admin.viewAll')} <ArrowIcon size={11} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {recentJobs.length === 0 ? (
                <p className="text-center text-white/25 text-sm py-8">{t('admin.noJobs')}</p>
              ) : recentJobs.map(j => {
                const jCfg = JOB_STATUS_CFG[j.status] || JOB_STATUS_CFG.pending;
                return (
                  <Link
                    key={j.id}
                    href="/admin/jobs"
                                        className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate group-hover:text-[#c8a96e] transition-colors">{j.fullName}</p>
                      <p className="text-xs text-white/30 mt-0.5 truncate">{j.position || '—'}{j.city ? ` · ${j.city}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ms-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ color: jCfg.color, background: `${jCfg.color}18`, border: `1px solid ${jCfg.color}30` }}>
                        {jCfg.label}
                      </span>
                      <span className="text-[10px] text-white/20 hidden sm:block" dir="ltr">
                        {j.createdAt?.seconds ? new Date(j.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </AdminPageLayout>
  );
}
