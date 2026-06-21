'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { STATUS_CONFIG, ACTIVITY_KEYS } from '@/lib/suppliersConfig';
import { useLanguage } from '@/context/LanguageContext';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import {
  Search, Trash2, Eye, CheckCircle, XCircle, Clock,
  Loader2, X, Mail, Phone, Building2, MapPin, Send, Briefcase,
} from 'lucide-react';
import Link from 'next/link';

const STATUS_FILTER_KEYS = ['all', 'new', 'under_review', 'approved', 'rejected'];
const STATUS_T_KEYS = {
  new:          'admin.statusNew',
  under_review: 'admin.statusUnderReview',
  approved:     'admin.statusApproved',
  rejected:     'admin.statusRejected',
};

export default function SuppliersListPage() {
  const { t, isRTL } = useLanguage();
  const getAct = (name) => name && (t('activities.' + ACTIVITY_KEYS[name]) || name);

  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null);

  // Accept dialog
  const [dialogSupplier, setDialogSupplier]     = useState(null);
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [sending, setSending]                   = useState(false);
  const [sendStatus, setSendStatus]             = useState('');
  const [sendError, setSendError]               = useState('');

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
      s.contactName?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.activity?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const updateStatus = async (id, status) => {
    setActionId(id + status);
    await updateDoc(doc(db, 'suppliers', id), { status, reviewedAt: new Date() });
    setActionId(null);
  };

  const deleteSupplier = async (id, name) => {
    if (!confirm(`${t('admin.delete')} "${name}"?`)) return;
    await deleteDoc(doc(db, 'suppliers', id));
  };

  const openAcceptDialog = (supplier) => {
    setDialogSupplier(supplier);
    setAdditionalMessage('');
    setSendStatus('');
    setSendError('');
  };

  const closeDialog = () => {
    setDialogSupplier(null);
    setSendStatus('');
    setSendError('');
  };

  const handleSendAcceptance = async () => {
    setSending(true);
    setSendStatus('');
    setSendError('');
    try {
      const res = await fetch('/api/send-supplier-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierName:      dialogSupplier.companyName,
          contactName:       dialogSupplier.contactName,
          supplierEmail:     dialogSupplier.email,
          activity:          getAct(dialogSupplier.activity) || dialogSupplier.activity,
          additionalMessage,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.code || 'Unknown error');

      await updateDoc(doc(db, 'suppliers', dialogSupplier.id), {
        status: 'approved',
        reviewedAt: new Date(),
        approvalEmailSentAt: new Date(),
      });

      setSendStatus('success');
      setTimeout(() => closeDialog(), 2000);
    } catch (err) {
      setSendStatus('error');
      setSendError(err.message || 'Unknown error');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('admin.suppliersMenu')}</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40`}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTER_KEYS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border
                  ${filter === f
                    ? 'bg-[#c8a96e] border-[#c8a96e] text-black'
                    : 'border-white/10 text-white/50 hover:text-white'
                  }`}
              >
                {f === 'all' ? t('admin.allStatuses') : t(STATUS_T_KEYS[f])}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="text-[#c8a96e] animate-spin" />
            </div>
          ) : visible.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-16">{t('admin.noResults')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="ltr">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {[
                      t('admin.companyNameCol'), t('admin.activityCol'), t('admin.cityCol'),
                      t('admin.phoneCol'), t('admin.submittedCol'), t('admin.statusCol'), t('admin.actionsCol')
                    ].map(h => (
                      <th key={h} className="text-left text-xs text-white/30 font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
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
                        <p className="text-xs text-white/30 mt-0.5">{s.contactName}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white/60 text-xs">{getAct(s.activity) || '—'}</td>
                      <td className="px-5 py-3.5 text-white/60">{s.city}{s.country ? `, ${s.country}` : ''}</td>
                      <td className="px-5 py-3.5 text-white/60" dir="ltr">{s.phone}</td>
                      <td className="px-5 py-3.5 text-white/40 text-xs">
                        {s.createdAt?.seconds
                          ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('en-GB')
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/suppliers/${s.id}`} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors" title={t('admin.viewDetails')}>
                            <Eye size={15} />
                          </Link>
                          {s.status !== 'approved' && (
                            <button
                              onClick={() => openAcceptDialog(s)}
                              disabled={actionId === s.id + 'approved'}
                              className="p-1.5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40"
                              title={t('admin.approve')}
                            >
                              {actionId === s.id + 'approved'
                                ? <Loader2 size={15} className="animate-spin" />
                                : <CheckCircle size={15} />}
                            </button>
                          )}
                          {s.status !== 'rejected' && (
                            <button onClick={() => updateStatus(s.id, 'rejected')} disabled={actionId === s.id + 'rejected'} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40" title={t('admin.reject')}>
                              {actionId === s.id + 'rejected' ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                            </button>
                          )}
                          {s.status !== 'under_review' && (
                            <button onClick={() => updateStatus(s.id, 'under_review')} disabled={actionId === s.id + 'under_review'} className="p-1.5 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-40" title={t('admin.underReviewAction')}>
                              {actionId === s.id + 'under_review' ? <Loader2 size={15} className="animate-spin" /> : <Clock size={15} />}
                            </button>
                          )}
                          <button onClick={() => deleteSupplier(s.id, s.companyName)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors" title={t('admin.delete')}>
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

      {/* ===== APPROVAL DIALOG ===== */}
      {dialogSupplier && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]" style={{ background: 'linear-gradient(135deg,rgba(184,146,58,0.1),rgba(0,0,0,0))' }}>
              <div>
                <h2 className="text-white font-bold text-base">إرسال رسالة قبول المورد</h2>
                <p className="text-white/40 text-xs mt-0.5">{dialogSupplier.companyName} — {dialogSupplier.contactName}</p>
              </div>
              <button onClick={closeDialog} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Supplier info */}
            <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Building2 size={12} className="text-[#c8a96e] shrink-0" />
                {dialogSupplier.companyName}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Mail size={12} className="text-[#c8a96e] shrink-0" />
                {dialogSupplier.email || <span className="text-red-400/70">لا يوجد إيميل</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Phone size={12} className="text-[#c8a96e] shrink-0" />
                {dialogSupplier.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <MapPin size={12} className="text-[#c8a96e] shrink-0" />
                {dialogSupplier.city}{dialogSupplier.country ? `, ${dialogSupplier.country}` : ''}
              </div>
            </div>

            {/* Email preview notice */}
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-start gap-3 bg-[#c8a96e]/8 border border-[#c8a96e]/20 rounded-xl px-4 py-3">
                <Mail size={14} className="text-[#c8a96e] mt-0.5 shrink-0" />
                <p className="text-white/60 text-xs leading-relaxed">
                  سيتم إرسال رسالة قبول احترافية تتضمن تهنئة المورد وتوضيح خطوات استكمال الإجراءات والزيارة للفرع.
                  يمكنك إضافة ملاحظة خاصة أدناه.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">
                  ملاحظة إضافية للمورد <span className="text-white/25 normal-case font-normal">(اختياري)</span>
                </label>
                <textarea
                  rows={3}
                  value={additionalMessage}
                  onChange={e => setAdditionalMessage(e.target.value)}
                  placeholder="مثال: يرجى التواصل خلال أسبوع من تاريخ هذه الرسالة..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all resize-none"
                />
              </div>

              {sendStatus === 'success' && (
                <p className="text-green-400 text-sm font-semibold text-center">تم الإرسال بنجاح ✓</p>
              )}
              {sendStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm font-semibold text-center mb-1">فشل الإرسال</p>
                  {sendError && <p className="text-red-300/70 text-xs text-center break-all">{sendError}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
              <button
                onClick={closeDialog}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:text-white hover:border-white/20 transition-all"
              >
                إلغاء
              </button>
              <button
                onClick={handleSendAcceptance}
                disabled={sending || !dialogSupplier.email}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a96e] to-[#B8923A] text-black text-sm font-black flex items-center justify-center gap-2 hover:from-[#D5B25D] hover:to-[#c8a96e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                إرسال رسالة القبول
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
