'use client';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG, FILE_FIELDS } from '@/lib/suppliersConfig';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  ArrowRight, Download, CheckCircle, XCircle, RefreshCw,
  Loader2, Save, Building2, User, Phone, Mail, MapPin,
  Calendar, FileText, Image as ImageIcon, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const FILE_ICONS = { images: ImageIcon };

export default function SupplierDetailPage() {
  const { id }           = useParams();
  const [supplier, setSupplier] = useState(null);
  const [notes, setNotes]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [actioning, setActioning] = useState('');

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'suppliers', id), snap => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setSupplier(data);
        setNotes(data.adminNotes ?? '');
      }
    });
    return unsub;
  }, [id]);

  const updateStatus = async (status) => {
    setActioning(status);
    await updateDoc(doc(db, 'suppliers', id), { status, reviewedAt: new Date() });
    setActioning('');
  };

  const saveNotes = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'suppliers', id), { adminNotes: notes });
    setSaving(false);
  };

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="text-[#c8a96e] animate-spin" />
      </div>
    );
  }

  const createdDate = supplier.createdAt?.seconds
    ? new Date(supplier.createdAt.seconds * 1000).toLocaleDateString('ar-SA', { year:'numeric', month:'long', day:'numeric' })
    : '—';

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto" dir="rtl">
      {/* Back */}
      <Link href="/admin/suppliers" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowRight size={16} />
        العودة إلى القائمة
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{supplier.companyName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={supplier.status} />
            <span className="text-xs text-white/30">تسجيل: {createdDate}</span>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {supplier.status !== 'under_review' && (
            <ActionBtn
              onClick={() => updateStatus('under_review')}
              loading={actioning === 'under_review'}
              icon={RefreshCw}
              label="قيد المراجعة"
              color="yellow"
            />
          )}
          {supplier.status !== 'approved' && (
            <ActionBtn
              onClick={() => updateStatus('approved')}
              loading={actioning === 'approved'}
              icon={CheckCircle}
              label="اعتماد"
              color="green"
            />
          )}
          {supplier.status !== 'rejected' && (
            <ActionBtn
              onClick={() => updateStatus('rejected')}
              loading={actioning === 'rejected'}
              icon={XCircle}
              label="رفض"
              color="red"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card title="المعلومات الأساسية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={Building2} label="اسم الشركة"  value={supplier.companyName} />
              <InfoRow icon={User}      label="المسؤول"     value={supplier.contactPerson} />
              <InfoRow icon={Phone}     label="الجوال"      value={supplier.phone} ltr />
              <InfoRow icon={Mail}      label="البريد"      value={supplier.email || '—'} ltr />
              <InfoRow icon={MapPin}    label="المدينة"     value={supplier.city} />
              <InfoRow icon={Calendar}  label="تاريخ التسجيل" value={createdDate} />
            </div>
          </Card>

          {/* Activity types */}
          <Card title="أنواع النشاط">
            <div className="flex flex-wrap gap-2">
              {(supplier.activityTypes ?? []).map(t => (
                <span key={t} className="bg-[#c8a96e]/10 text-[#c8a96e] text-xs px-3 py-1 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </Card>

          {/* Description */}
          {supplier.description && (
            <Card title="وصف النشاط">
              <p className="text-sm text-white/60 leading-relaxed">{supplier.description}</p>
            </Card>
          )}

          {/* Files */}
          <Card title="المستندات والملفات">
            <div className="space-y-3">
              {FILE_FIELDS.map(field => {
                const val = supplier[field.key];
                const Icon = FILE_ICONS[field.key] ?? FileText;
                if (!val) return (
                  <div key={field.key} className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
                    <span className="text-sm text-white/30">{field.label}</span>
                    <span className="text-xs text-white/20">غير مرفق</span>
                  </div>
                );
                const urls = Array.isArray(val) ? val : [val];
                return (
                  <div key={field.key} className="py-2 border-b border-white/[0.05] last:border-0">
                    <p className="text-xs text-white/40 mb-2">{field.label}</p>
                    <div className="space-y-1.5">
                      {urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-xl px-3 py-2 transition-colors group"
                        >
                          <Icon size={14} className="text-[#c8a96e] shrink-0" />
                          <span className="text-xs text-white/60 flex-1 truncate">
                            {field.label}{urls.length > 1 ? ` (${i + 1})` : ''}
                          </span>
                          <ExternalLink size={13} className="text-white/20 group-hover:text-white/50 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right col: admin notes */}
        <div className="space-y-6">
          <Card title="ملاحظات المسؤول">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={8}
              placeholder="أضف ملاحظاتك حول هذا المورد..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 resize-none transition-colors"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-3 w-full bg-[#c8a96e]/10 hover:bg-[#c8a96e]/20 border border-[#c8a96e]/20 text-[#c8a96e] text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'جاري الحفظ...' : 'حفظ الملاحظات'}
            </button>
          </Card>

          {/* Status history */}
          <Card title="حالة الطلب">
            <div className="space-y-3">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <div key={key} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors
                  ${supplier.status === key ? 'bg-white/5' : 'opacity-30'}`}>
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  <span className="text-sm" style={{ color: supplier.status === key ? cfg.color : 'white' }}>
                    {cfg.label}
                  </span>
                  {supplier.status === key && (
                    <span className="mr-auto text-xs text-white/30">الحالة الحالية</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5">
      <h3 className="text-xs font-semibold text-[#c8a96e] uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, ltr }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-white/30 flex items-center gap-1.5">
        <Icon size={11} /> {label}
      </span>
      <span className="text-sm text-white/80" dir={ltr ? 'ltr' : undefined}>{value || '—'}</span>
    </div>
  );
}

function ActionBtn({ onClick, loading, icon: Icon, label, color }) {
  const colors = {
    green:  'text-green-400 border-green-500/20 hover:bg-green-500/10',
    red:    'text-red-400  border-red-500/20   hover:bg-red-500/10',
    yellow: 'text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/10',
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 ${colors[color]}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
      {label}
    </button>
  );
}
