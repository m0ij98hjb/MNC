'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG } from '@/lib/suppliersConfig';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationsContext';
import {
  Users, Clock, CheckCircle, XCircle, TrendingUp,
  Briefcase, Building2, ArrowLeft, ArrowRight,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Link from 'next/link';

const STAT_META = {
  total:        { icon: Users,       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  new:          { icon: TrendingUp,  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  under_review: { icon: Clock,       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  approved:     { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  rejected:     { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
};

const JOB_STATUS = {
  pending:             { color: '#3b82f6', label: 'جديد' },
  interview_scheduled: { color: '#f59e0b', label: 'مقابلة محددة' },
  rejected:            { color: '#ef4444', label: 'مرفوض' },
};

export default function DashboardPage() {
  const { t, isRTL } = useLanguage();
  const { markSeen } = useNotifications() ?? { markSeen: () => {} };
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [counts, setCounts]           = useState({ total: 0, new: 0, under_review: 0, approved: 0, rejected: 0 });
  const [recentSuppliers, setRecentSuppliers] = useState([]);
  const [recentJobs, setRecentJobs]   = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const c = { total: docs.length, new: 0, under_review: 0, approved: 0, rejected: 0 };
      docs.forEach(d => { if (c[d.status] !== undefined) c[d.status]++; });
      setCounts(c);
      setRecentSuppliers(
        [...docs].sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)).slice(0, 6)
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobApplications'), snap => {
      setRecentJobs(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          .slice(0, 6)
      );
    });
    return unsub;
  }, []);

  const stats = [
    { key: 'total',        labelKey: 'admin.total'       },
    { key: 'new',          labelKey: 'admin.new'         },
    { key: 'under_review', labelKey: 'admin.underReview' },
    { key: 'approved',     labelKey: 'admin.approved'    },
    { key: 'rejected',     labelKey: 'admin.rejected'    },
  ];

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{t('admin.dashboard')}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {stats.map(({ key, labelKey }) => {
            const { icon: Icon, color, bg } = STAT_META[key];
            return (
              <div key={key} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">{t(labelKey)}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{counts[key]}</p>
              </div>
            );
          })}
        </div>

        {/* Recent — split two halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Suppliers ── */}
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
                  onClick={() => markSeen(s.id)}
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

          {/* ── Jobs ── */}
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
                const jStatus = JOB_STATUS[j.status] || JOB_STATUS.pending;
                return (
                  <Link
                    key={j.id}
                    href="/admin/jobs"
                    onClick={() => markSeen(j.id)}
                    className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate group-hover:text-[#c8a96e] transition-colors">{j.fullName}</p>
                      <p className="text-xs text-white/30 mt-0.5 truncate">{j.position || '—'} · {j.city || j.experience || ''}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ms-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ color: jStatus.color, background: `${jStatus.color}18`, border: `1px solid ${jStatus.color}30` }}>
                        {jStatus.label}
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
