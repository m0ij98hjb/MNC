'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG } from '@/lib/suppliersConfig';
import StatusBadge from '@/components/admin/StatusBadge';
import { Search, Trash2, Eye, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

const STATUS_FILTERS = ['all', 'new', 'under_review', 'approved', 'rejected'];

export default function SuppliersListPage() {
  const [suppliers, setSuppliers]   = useState([]);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setSuppliers(docs);
      setLoading(false);
    });
    return unsub;
  }, []);

  const visible = suppliers.filter(s => {
    const matchStatus = filter === 'all' || s.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.companyName?.toLowerCase().includes(q) ||
      s.contactPerson?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.city?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const updateStatus = async (id, status) => {
    setActionId(id + status);
    await updateDoc(doc(db, 'suppliers', id), {
      status,
      reviewedAt: new Date(),
    });
    setActionId(null);
  };

  const deleteSupplier = async (id, name) => {
    if (!confirm(`هل تريد حذف مورد "${name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    await deleteDoc(doc(db, 'suppliers', id));
  };

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">الموردون</h1>
        <p className="text-sm text-white/40 mt-1">إدارة وتصفية جميع الموردين المسجلين</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الجوال..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-9 pl-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border
                ${filter === f
                  ? 'bg-[#c8a96e] border-[#c8a96e] text-black'
                  : 'border-white/10 text-white/50 hover:text-white'
                }`}
            >
              {f === 'all' ? 'الكل' : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-[#c8a96e] animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-white/30 text-sm py-16">لا توجد نتائج</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['اسم الشركة','المسؤول','الجوال','المدينة','النشاط','الحالة','الإجراءات'].map(h => (
                    <th key={h} className="text-right text-xs text-white/30 font-medium px-5 py-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {visible.map(s => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/suppliers/${s.id}`} className="text-white font-medium hover:text-[#c8a96e] transition-colors">
                        {s.companyName}
                      </Link>
                      <p className="text-xs text-white/30 mt-0.5">
                        {s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-white/70">{s.contactPerson}</td>
                    <td className="px-5 py-3.5 text-white/70 dir-ltr" dir="ltr">{s.phone}</td>
                    <td className="px-5 py-3.5 text-white/70">{s.city}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {(s.activityTypes ?? []).slice(0, 2).map(t => (
                          <span key={t} className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                        {(s.activityTypes ?? []).length > 2 && (
                          <span className="text-xs text-white/30">+{s.activityTypes.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/suppliers/${s.id}`}
                          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                          title="عرض"
                        >
                          <Eye size={15} />
                        </Link>
                        {s.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(s.id, 'approved')}
                            disabled={actionId === s.id + 'approved'}
                            className="p-1.5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40"
                            title="اعتماد"
                          >
                            {actionId === s.id + 'approved' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                          </button>
                        )}
                        {s.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(s.id, 'rejected')}
                            disabled={actionId === s.id + 'rejected'}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                            title="رفض"
                          >
                            {actionId === s.id + 'rejected' ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                          </button>
                        )}
                        {s.status !== 'under_review' && s.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(s.id, 'under_review')}
                            className="p-1.5 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                            title="قيد المراجعة"
                          >
                            <RefreshCw size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteSupplier(s.id, s.companyName)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
