'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Building2, Phone, MapPin, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ApprovedSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch]       = useState('');
  const [city, setCity]           = useState('');
  const [activity, setActivity]   = useState('');
  const [cities, setCities]       = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'suppliers'), where('status', '==', 'approved'));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSuppliers(docs);

      const allCities = [...new Set(docs.map(d => d.city).filter(Boolean))].sort();
      const allActivities = [...new Set(docs.flatMap(d => d.activityTypes ?? []))].sort();
      setCities(allCities);
      setActivities(allActivities);
    });
    return unsub;
  }, []);

  const visible = suppliers.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.companyName?.toLowerCase().includes(q) ||
      s.contactPerson?.toLowerCase().includes(q) ||
      s.phone?.includes(q);
    const matchCity     = !city     || s.city === city;
    const matchActivity = !activity || (s.activityTypes ?? []).includes(activity);
    return matchSearch && matchCity && matchActivity;
  });

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">الموردون المعتمدون</h1>
        <p className="text-sm text-white/40 mt-1">
          قاعدة بيانات الموردين المعتمدين لدى MNC — إجمالي: <strong className="text-[#c8a96e]">{suppliers.length}</strong>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-9 pl-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40"
          />
        </div>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#c8a96e]/40"
        >
          <option value="">كل المدن</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={activity}
          onChange={e => setActivity(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#c8a96e]/40"
        >
          <option value="">كل الأنشطة</option>
          {activities.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">
          {suppliers.length === 0 ? 'لا يوجد موردون معتمدون بعد' : 'لا توجد نتائج مطابقة'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map(s => (
            <Link
              key={s.id}
              href={`/admin/suppliers/${s.id}`}
              className="group bg-white/[0.02] border border-white/[0.07] hover:border-[#c8a96e]/30 rounded-2xl p-5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#c8a96e]/10 flex items-center justify-center">
                  <Building2 size={18} className="text-[#c8a96e]" />
                </div>
                <Eye size={14} className="text-white/20 group-hover:text-white/50 mt-1 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{s.companyName}</h3>
              <p className="text-xs text-white/40 mb-3">{s.contactPerson}</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <MapPin size={11} /> {s.city}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40" dir="ltr">
                  <Phone size={11} /> {s.phone}
                </div>
              </div>
              {(s.activityTypes ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {s.activityTypes.slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                  {s.activityTypes.length > 2 && (
                    <span className="text-[10px] text-white/20">+{s.activityTypes.length - 2}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
