'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG } from '@/lib/suppliersConfig';
import { useLanguage } from '@/context/LanguageContext';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#c8a96e','#3b82f6','#10b981','#f59e0b','#ef4444','#a78bfa','#ec4899','#14b8a6','#f97316','#06b6d4'];

export default function ReportsPage() {
  const { t, isRTL } = useLanguage();
  const [suppliers, setSuppliers] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  if (!suppliers) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
        </div>
      </AdminPageLayout>
    );
  }

  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: suppliers.filter(s => s.status === key).length,
    color: cfg.color,
  })).filter(d => d.value > 0);

  const actMap = {};
  suppliers.forEach(s => { if (s.activity) actMap[s.activity] = (actMap[s.activity] ?? 0) + 1; });
  const activityData = Object.entries(actMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const cityMap = {};
  suppliers.forEach(s => { if (s.city) cityMap[s.city] = (cityMap[s.city] ?? 0) + 1; });
  const cityData = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const monthMap = {};
  suppliers.forEach(s => {
    if (!s.createdAt?.seconds) return;
    const d   = new Date(s.createdAt.seconds * 1000);
    const key = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });
  const monthlyData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

  const approvedCount = suppliers.filter(s => s.status === 'approved').length;

  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
        <p className="text-white/50 mb-1">{label ?? payload[0].name}</p>
        <p className="font-bold text-[#c8a96e]">{payload[0].value}</p>
      </div>
    );
  };

  const summaryItems = [
    { label: t('admin.total'),       value: suppliers.length,                                          color: '#a78bfa' },
    { label: t('admin.approved'),    value: approvedCount,                                             color: '#10b981' },
    { label: t('admin.underReview'), value: suppliers.filter(s => s.status === 'under_review').length, color: '#f59e0b' },
    { label: t('admin.reportsMenu'), value: Object.keys(actMap).length,                                color: '#c8a96e' },
  ];

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{t('admin.reportsTitle')}</h1>
          <p className="text-sm text-white/40 mt-1">
            {suppliers.length} {t('admin.suppliersMenu').toLowerCase()}
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {summaryItems.map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
              <p className="text-xs text-white/40 mb-2">{label}</p>
              <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <ChartCard title={t('admin.statusDist')}>
            {statusData.length === 0 ? <Empty label={t('admin.notEnoughData')} /> : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={90} outerRadius={140} paddingAngle={3} dataKey="value">
                    {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <Legend formatter={v => <span className="text-xs text-white/60">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title={t('admin.monthlyReg')}>
            {monthlyData.length === 0 ? <Empty label={t('admin.notEnoughData')} /> : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="count" stroke="#c8a96e" strokeWidth={2.5} dot={{ fill: '#c8a96e', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title={t('admin.byActivity')}>
            {activityData.length === 0 ? <Empty label={t('admin.notEnoughData')} /> : (
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={activityData} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={150} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {activityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title={t('admin.byCity')}>
            {cityData.length === 0 ? <Empty label={t('admin.notEnoughData')} /> : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={cityData}>
                  <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {cityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </AdminPageLayout>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ label }) {
  return <p className="text-center text-white/20 text-sm py-16">{label}</p>;
}
