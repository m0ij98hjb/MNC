'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG, ACTIVITY_TYPES } from '@/lib/suppliersConfig';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Loader2 } from 'lucide-react';

const CHART_COLORS = ['#c8a96e','#3b82f6','#10b981','#f59e0b','#ef4444','#a78bfa','#ec4899','#14b8a6'];

export default function ReportsPage() {
  const [suppliers, setSuppliers] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suppliers'), snap => {
      setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  if (!suppliers) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
      </div>
    );
  }

  // Status distribution
  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: suppliers.filter(s => s.status === key).length,
    color: cfg.color,
  })).filter(d => d.value > 0);

  // Activity distribution (top 10)
  const activityMap = {};
  suppliers.forEach(s => {
    (s.activityTypes ?? []).forEach(t => {
      activityMap[t] = (activityMap[t] ?? 0) + 1;
    });
  });
  const activityData = Object.entries(activityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // City distribution (top 10)
  const cityMap = {};
  suppliers.forEach(s => {
    if (s.city) cityMap[s.city] = (cityMap[s.city] ?? 0) + 1;
  });
  const cityData = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Monthly registrations (last 6 months)
  const monthMap = {};
  suppliers.forEach(s => {
    if (!s.createdAt?.seconds) return;
    const d = new Date(s.createdAt.seconds * 1000);
    const key = d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' });
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });
  const monthlyData = Object.entries(monthMap)
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
        <p className="text-white/50 mb-1">{label ?? payload[0].name}</p>
        <p className="font-bold text-[#c8a96e]">{payload[0].value}</p>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">التقارير والإحصائيات</h1>
        <p className="text-sm text-white/40 mt-1">
          تحليل بيانات {suppliers.length} مورد مسجل
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie */}
        <ChartCard title="توزيع الحالات">
          {statusData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs text-white/60">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Monthly Line */}
        <ChartCard title="التسجيلات الشهرية">
          {monthlyData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#c8a96e"
                  strokeWidth={2.5}
                  dot={{ fill: '#c8a96e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Activity Bar */}
        <ChartCard title="أكثر الأنشطة تسجيلًا">
          {activityData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={activityData} layout="vertical">
                <XAxis type="number" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {activityData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* City Bar */}
        <ChartCard title="توزيع الموردين بالمدن">
          {cityData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cityData}>
                <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {cityData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
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

function Empty() {
  return <p className="text-center text-white/20 text-sm py-16">لا توجد بيانات كافية بعد</p>;
}
