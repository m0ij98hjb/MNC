'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import PurchasingAccessGate from '@/components/purchasing/PurchasingAccessGate';
import ItemsTable, { computeItemTotals } from '@/components/purchasing/ItemsTable';
import AttachmentsUploader from '@/components/purchasing/AttachmentsUploader';
import { addHistoryEntry } from '@/lib/purchasingApi';
import { PRIORITY, PRIORITY_LABEL_KEYS } from '@/lib/purchasingConfig';
import { Loader2, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#c8a96e]/60 focus:bg-black/20 outline-none transition-all';
const labelCls = 'text-[#c8a96e] text-[11px] font-black uppercase tracking-widest block mb-1.5';

function EditRequestContent({ id }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();
  const { profile, role } = usePurchasingRole();
  const [request, setRequest] = useState(undefined);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'purchaseRequests', id), snap => {
      if (!snap.exists()) { setRequest(null); return; }
      const data = { id: snap.id, ...snap.data() };
      setRequest(data);
      setForm(f => f || {
        projectName: data.projectName || '', projectCode: data.projectCode || '', siteName: data.siteName || '',
        requesterName: data.requesterName || '', requesterPhone: data.requesterPhone || '', requesterEmail: data.requesterEmail || '',
        jobTitle: data.jobTitle || '', department: data.department || '', priority: data.priority || PRIORITY.NORMAL,
        reason: data.reason || '', generalNotes: data.generalNotes || '',
        items: data.items || [], attachments: data.attachments || [],
      });
    });
    return unsub;
  }, [id]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const { totalQuantity, totalEstimatedCost } = useMemo(() => form ? computeItemTotals(form.items) : { totalQuantity: 0, totalEstimatedCost: 0 }, [form]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const validItems = form.items.filter(it => it.itemName.trim() && Number(it.quantity) > 0);
      await updateDoc(doc(db, 'purchaseRequests', id), {
        ...form,
        items: validItems,
        totalQuantity, totalEstimatedCost,
        updatedAt: serverTimestamp(),
      });
      await addHistoryEntry(id, {
        userId: user.uid, userName: profile?.name || user?.displayName || user?.email || '—', role,
        action: 'edited', previousStatus: request.status, newStatus: request.status,
        notes: t('purchasing.adminEditedNote'),
      });
      router.push(`/admin/purchasing/requests/${id}`);
    } catch (err) {
      setError(err.message || t('purchasing.actionFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (request === undefined || !form) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={28} className="animate-spin text-[#c8a96e]" /></div>;
  if (request === null) return <div className="flex items-center justify-center min-h-[60vh] text-white/40">{t('admin.noResults')}</div>;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{t('purchasing.editRequestTitle')}</h1>
          <p className="text-sm text-white/40 mt-1" dir="ltr">{request.requestNumber}</p>
        </div>
        <Link href={`/admin/purchasing/requests/${id}`} className="text-xs text-[#c8a96e] hover:underline flex items-center gap-1">
          {isRTL ? <ArrowRight size={12} /> : <ArrowLeft size={12} />} {t('purchasing.backToRequest')}
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
        {error && <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/25 text-red-400">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelCls}>{t('purchasing.requesterName')}</label>
            <input className={inputCls} value={form.requesterName} onChange={e => set('requesterName', e.target.value)} required /></div>
          <div><label className={labelCls}>{t('purchasing.requesterPhone')}</label>
            <input className={inputCls} dir="ltr" value={form.requesterPhone} onChange={e => set('requesterPhone', e.target.value)} /></div>
          <div><label className={labelCls}>{t('purchasing.requesterEmail')}</label>
            <input type="email" className={inputCls} dir="ltr" value={form.requesterEmail} onChange={e => set('requesterEmail', e.target.value)} /></div>
          <div><label className={labelCls}>{t('purchasing.jobTitle')}</label>
            <input className={inputCls} value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} /></div>
          <div><label className={labelCls}>{t('purchasing.department')}</label>
            <input className={inputCls} value={form.department} onChange={e => set('department', e.target.value)} /></div>
          <div>
            <label className={labelCls}>{t('purchasing.priority')}</label>
            <select className={`${inputCls} appearance-none cursor-pointer`} value={form.priority} onChange={e => set('priority', e.target.value)}>
              {Object.values(PRIORITY).map(p => <option key={p} value={p} className="bg-slate-800">{t(PRIORITY_LABEL_KEYS[p])}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelCls}>{t('purchasing.projectName')}</label>
            <input className={inputCls} value={form.projectName} onChange={e => set('projectName', e.target.value)} required /></div>
          <div><label className={labelCls}>{t('purchasing.projectCode')}</label>
            <input className={inputCls} dir="ltr" value={form.projectCode} onChange={e => set('projectCode', e.target.value)} /></div>
          <div><label className={labelCls}>{t('purchasing.siteName')}</label>
            <input className={inputCls} value={form.siteName} onChange={e => set('siteName', e.target.value)} required /></div>
        </div>

        <div><label className={labelCls}>{t('purchasing.requestReason')}</label>
          <input className={inputCls} value={form.reason} onChange={e => set('reason', e.target.value)} required /></div>

        <div>
          <label className={labelCls}>{t('purchasing.itemsTableTitle')}</label>
          <ItemsTable items={form.items} onChange={items => set('items', items)} />
        </div>

        <div>
          <label className={labelCls}>{t('purchasing.attachments')}</label>
          <AttachmentsUploader pathPrefix={`purchaseRequests/${id}`} attachments={form.attachments} onChange={a => set('attachments', a)} />
        </div>

        <div><label className={labelCls}>{t('purchasing.generalNotes')}</label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={form.generalNotes} onChange={e => set('generalNotes', e.target.value)} /></div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} {t('admin.saveChangesBtn')}
          </button>
          <Link href={`/admin/purchasing/requests/${id}`} className="flex items-center px-5 py-3 rounded-xl text-sm font-bold text-white/60 border border-white/10 hover:text-white hover:border-white/20 transition-all">
            {t('admin.cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function EditRequestPage() {
  const { id } = useParams();
  return (
    <PurchasingAccessGate allow={['procurement_manager']}>
      <AdminPageLayout><EditRequestContent id={id} /></AdminPageLayout>
    </PurchasingAccessGate>
  );
}
