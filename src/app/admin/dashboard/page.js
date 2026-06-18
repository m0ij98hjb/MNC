'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG } from '@/lib/suppliersConfig';
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import Link from 'next/link';

const STAT_META = {
  total:        { icon: Users,       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  new:          { icon: TrendingUp,  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  under_review: { icon: Clock,       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  approved:     { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  rejected:     { icon: XCircle,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
};

export default function DashboardPage() {
  const [counts, setCounts] = useState({ total: 0, new: 0, under_review: 0, approved: 0, rejected: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const c = { total: docs.length, new: 0, under_review: 0, approved: 0, rejected: 0 };
      docs.forEach(d => { if (c[d.status] !== undefined) c[d.status]++; });
      setCounts(c);
      setRecent(
        [...docs]
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
          .slice(0, 8)
      );
    });
    return unsub;
  }, []);

  const stats = [
    { key: 'total',        label: 'Total Suppliers'  },
    { key: 'new',          label: 'New Requests'     },
    { key: 'under_review', label: 'Under Review'     },
    { key: 'approved',     label: 'Approved'         },
    { key: 'rejected',     label: 'Rejected'         },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Overview of registered suppliers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map(({ key, label }) => {
          const { icon: Icon, color, bg } = STAT_META[key];
          return (
            <div key={key} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{counts[key]}</p>
            </div>
          );
        })}
      </div>

      {/* Recent */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="text-sm font-semibold text-white">Latest Submissions</h2>
          <Link href="/admin/suppliers" className="text-xs text-[#c8a96e] hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {recent.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-10">No suppliers yet</p>
          ) : recent.map(s => (
            <Link
              key={s.id}
              href={`/admin/suppliers/${s.id}`}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.03] transition-colors"
            >
              <div>
                <p className="text-sm text-white font-medium">{s.companyName}</p>
                <p className="text-xs text-white/30 mt-0.5">
                  {s.city}{s.country ? `, ${s.country}` : ''} · {s.activity || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={s.status} />
                <span className="text-xs text-white/20 hidden sm:block">
                  {s.createdAt?.seconds
                    ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('en-GB')
                    : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
