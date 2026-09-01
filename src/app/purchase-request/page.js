'use client';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  collection, doc, addDoc, updateDoc, query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePurchasingRole } from '@/hooks/usePurchasingRole';
import Navbar from '@/components/layout/Navbar';
import ItemsTable, { blankItem, computeItemTotals } from '@/components/purchasing/ItemsTable';
import AttachmentsUploader from '@/components/purchasing/AttachmentsUploader';
import PurchaseStatusBadge from '@/components/purchasing/PurchaseStatusBadge';
import ApprovalTimeline from '@/components/purchasing/ApprovalTimeline';
import { nextRequestNumber, addHistoryEntry, addApprovalRecord, notify } from '@/lib/purchasingApi';
import { PRIORITY, PRIORITY_LABEL_KEYS, ROLES, STATUS } from '@/lib/purchasingConfig';
import {
  Loader2, Mail, Lock, Eye, EyeOff, FileText, ListChecks, Send, ShieldAlert,
  ChevronDown, ChevronUp, Pencil, PenLine, X,
} from 'lucide-react';

const SignaturePad = dynamic(() => import('@/components/purchasing/SignaturePad'), { ssr: false });

const inputCls = 'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#c8a96e]/60 focus:bg-black/60 outline-none transition-all duration-300';
const labelCls = 'text-[#c8a96e] text-[11px] font-black uppercase tracking-widest block mb-1.5';

function emptyForm(profile, user) {
  return {
    projectName: profile?.projectName || '',
    projectCode: '',
    siteName: '',
    requesterName: profile?.name || user?.displayName || '',
    requesterPhone: profile?.phone || '',
    requesterEmail: profile?.email || user?.email || '',
    jobTitle: profile?.jobTitle || '',
    department: profile?.department || '',
    priority: PRIORITY.NORMAL,
    reason: '',
    generalNotes: '',
    items: [blankItem()],
    attachments: [],
  };
}

/* ─────────────────────────── Inline login ─────────────────────────── */
function InlineLogin() {
  const { login, error, setError } = useAuth();
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-black/40 border border-[#c8a96e]/20 rounded-2xl p-7 sm:p-8 space-y-5">
        <div className="text-center mb-2">
          <h1 className="text-xl font-black text-white">{t('purchasing.portalLoginTitle')}</h1>
          <p className="text-sm text-white/40 mt-1.5">{t('purchasing.portalLoginSubtitle')}</p>
        </div>
        {error && (
          <div className="rounded-xl px-4 py-3 text-sm text-center bg-red-500/10 border border-red-500/25 text-red-400">
            {t('admin.loginError')}
          </div>
        )}
        <div>
          <label className={labelCls}>{t('admin.emailLabel')}</label>
          <div className="relative">
            <Mail size={14} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#c8a96e]/40" />
            <input type="email" required dir="ltr" value={email}
              onChange={e => { setEmail(e.target.value); setError?.(''); }}
              className={`${inputCls} ps-10`} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t('admin.passwordLabel')}</label>
          <div className="relative">
            <Lock size={14} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#c8a96e]/40" />
            <input type={showPass ? 'text' : 'password'} required dir="ltr" value={password}
              onChange={e => { setPassword(e.target.value); setError?.(''); }}
              className={`${inputCls} ps-10 pe-10`} />
            <button type="button" onClick={() => setShowPass(v => !v)} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-[#c8a96e]">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
        </button>
      </form>
    </section>
  );
}

/* ─────────────────────────── New / edit request form ─────────────────────────── */
function RequestForm({ profile, user, editingRequest, onDone }) {
  const { t, isRTL } = useLanguage();
  const [form, setForm] = useState(() => editingRequest ? {
    projectName: editingRequest.projectName, projectCode: editingRequest.projectCode || '',
    siteName: editingRequest.siteName, requesterName: editingRequest.requesterName,
    requesterPhone: editingRequest.requesterPhone, requesterEmail: editingRequest.requesterEmail,
    jobTitle: editingRequest.jobTitle, department: editingRequest.department,
    priority: editingRequest.priority, reason: editingRequest.reason,
    generalNotes: editingRequest.generalNotes, items: editingRequest.items, attachments: editingRequest.attachments || [],
  } : emptyForm(profile, user));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signError, setSignError] = useState('');
  const [showPmSignDialog, setShowPmSignDialog] = useState(false);
  const [pmName, setPmName] = useState('');
  const [pmSignature, setPmSignature] = useState(null);
  const [pmSignError, setPmSignError] = useState('');

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const { totalQuantity, totalEstimatedCost } = useMemo(() => computeItemTotals(form.items), [form.items]);

  const validItems = form.items.filter(it => it.itemName.trim() && Number(it.quantity) > 0);

  const handleValidateAndOpenSign = (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectName.trim() || !form.siteName.trim() || !form.reason.trim()) {
      setError(t('purchasing.fillRequiredFields')); return;
    }
    if (validItems.length === 0) {
      setError(t('purchasing.needAtLeastOneItem')); return;
    }
    setSignature(null);
    setSignError('');
    setPmName('');
    setPmSignature(null);
    setPmSignError('');
    setShowSignDialog(true);
  };

  // Dialog 1 (site engineer) just captures the signature — the actual submit
  // happens after dialog 2 (project manager) also signs, so the request is
  // only ever written to Firestore once, carrying both signatures.
  const handleConfirmSignature = () => {
    if (!signature) { setSignError(t('purchasing.submitSignatureRequired')); return; }
    setSignError('');
    setShowSignDialog(false);
    setShowPmSignDialog(true);
  };

  const handleConfirmPmSignature = async () => {
    if (!pmName.trim()) { setPmSignError(t('purchasing.pmNameRequired')); return; }
    if (!pmSignature) { setPmSignError(t('purchasing.pmSignatureRequired')); return; }
    setPmSignError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: validItems,
        totalQuantity, totalEstimatedCost,
        requesterSignature: signature,
        projectManagerName: pmName.trim(),
        projectManagerSignature: pmSignature,
        updatedAt: serverTimestamp(),
      };
      // Two digital sign-offs happen back-to-back on this same form — site
      // engineer then project manager — before the request goes straight to
      // the procurement manager, who is the only asynchronous approval stage.
      const approverName = signature.type === 'typed' ? signature.value : form.requesterName;
      const pmApproverName = pmSignature.type === 'typed' ? pmSignature.value : pmName.trim();

      if (editingRequest) {
        payload.status = STATUS.PENDING_PROC_APPROVAL;
        await updateDoc(doc(db, 'purchaseRequests', editingRequest.id), payload);
        await addHistoryEntry(editingRequest.id, {
          userId: user.uid, userName: approverName, role: ROLES.SITE_SUPERVISOR,
          action: 'resubmitted', previousStatus: STATUS.RETURNED, newStatus: STATUS.PENDING_PROC_APPROVAL,
          notes: '',
        });
        await addApprovalRecord(editingRequest.id, {
          stage: 'site_supervisor', decision: 'submit',
          approverUid: user.uid, approverName, jobTitle: form.jobTitle || '',
          signature, comment: '',
        });
        await addHistoryEntry(editingRequest.id, {
          userId: user.uid, userName: pmApproverName, role: ROLES.PROJECT_MANAGER,
          action: 'project_manager_signed', previousStatus: null, newStatus: null, notes: '',
        });
        await addApprovalRecord(editingRequest.id, {
          stage: 'project_manager', decision: 'submit',
          approverUid: user.uid, approverName: pmApproverName, jobTitle: '',
          signature: pmSignature, comment: '',
        });
        await notify({
          targetRole: ROLES.PROCUREMENT_MANAGER, type: 'stage_pending',
          requestId: editingRequest.id, requestNumber: editingRequest.requestNumber,
          title: t('purchasing.notifPendingApprovalTitle'),
          message: `${editingRequest.requestNumber} — ${form.projectName}`,
        });
      } else {
        const requestNumber = await nextRequestNumber();
        const docRef = await addDoc(collection(db, 'purchaseRequests'), {
          ...payload,
          requestNumber,
          requestDate: new Date().toISOString().slice(0, 10),
          requesterUid: user.uid,
          status: STATUS.PENDING_PROC_APPROVAL,
          createdAt: serverTimestamp(),
          submittedAt: serverTimestamp(),
        });
        await addHistoryEntry(docRef.id, {
          userId: user.uid, userName: approverName, role: ROLES.SITE_SUPERVISOR,
          action: 'submitted', previousStatus: null, newStatus: STATUS.PENDING_PROC_APPROVAL, notes: '',
        });
        await addApprovalRecord(docRef.id, {
          stage: 'site_supervisor', decision: 'submit',
          approverUid: user.uid, approverName, jobTitle: form.jobTitle || '',
          signature, comment: '',
        });
        await addHistoryEntry(docRef.id, {
          userId: user.uid, userName: pmApproverName, role: ROLES.PROJECT_MANAGER,
          action: 'project_manager_signed', previousStatus: null, newStatus: null, notes: '',
        });
        await addApprovalRecord(docRef.id, {
          stage: 'project_manager', decision: 'submit',
          approverUid: user.uid, approverName: pmApproverName, jobTitle: '',
          signature: pmSignature, comment: '',
        });
        await notify({
          targetRole: ROLES.PROCUREMENT_MANAGER, type: 'stage_pending',
          requestId: docRef.id, requestNumber,
          title: t('purchasing.notifPendingApprovalTitle'),
          message: `${requestNumber} — ${form.projectName}`,
        });
      }
      setShowPmSignDialog(false);
      onDone();
    } catch (err) {
      setPmSignError(err.message || t('purchasing.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleValidateAndOpenSign} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {error && <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/25 text-red-400">{error}</div>}

      {/* Requester info */}
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

      {/* Project info */}
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

      {/* Items table */}
      <div>
        <label className={labelCls}>{t('purchasing.itemsTableTitle')}</label>
        <ItemsTable items={form.items} onChange={items => set('items', items)} />
      </div>

      {/* Attachments */}
      <div>
        <label className={labelCls}>{t('purchasing.attachments')}</label>
        <AttachmentsUploader
          pathPrefix={`purchaseRequests/${editingRequest?.id || user.uid}`}
          attachments={form.attachments}
          onChange={a => set('attachments', a)}
        />
      </div>

      <div><label className={labelCls}>{t('purchasing.generalNotes')}</label>
        <textarea rows={3} className={`${inputCls} resize-none`} value={form.generalNotes} onChange={e => set('generalNotes', e.target.value)} /></div>

      {/* Approval status (read-only, no approve buttons here) */}
      <div className="flex items-center gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
        <ShieldAlert size={16} className="text-blue-400 shrink-0" />
        <p className="text-sm text-white/60">
          {t('purchasing.approvalStatusLabel')}: <span className="font-bold text-blue-300">{t('purchasing.statusPendingProcurement')}</span>
        </p>
      </div>

      <button type="submit" disabled={submitting}
        className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {editingRequest ? t('purchasing.resubmitRequest') : t('purchasing.submitRequest')}
      </button>

      {showSignDialog && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !submitting && setShowSignDialog(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0a0e17] border border-[#c8a96e]/25 rounded-2xl p-6 sm:p-7 space-y-5"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(200,169,110,0.12)' }}>
                  <PenLine size={18} className="text-[#c8a96e]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">{t('purchasing.submitSignatureDialogTitle')}</h2>
                  <p className="text-xs text-white/45 mt-1">{t('purchasing.submitSignatureDialogDesc')}</p>
                </div>
              </div>
              <button type="button" disabled={submitting} onClick={() => setShowSignDialog(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all shrink-0 disabled:opacity-40">
                <X size={14} />
              </button>
            </div>

            <div>
              <label className={labelCls}>{t('purchasing.engineerNameLabel')}</label>
              <input className={inputCls} value={form.requesterName} onChange={e => set('requesterName', e.target.value)} />
            </div>

            <SignaturePad onChange={setSignature} defaultName={form.requesterName} />

            {signError && <div className="rounded-xl px-4 py-2.5 text-xs bg-red-500/10 border border-red-500/25 text-red-400">{signError}</div>}

            <div className="flex gap-2.5">
              <button type="button" disabled={submitting} onClick={() => setShowSignDialog(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/60 border border-white/10 hover:text-white hover:border-white/20 transition-all disabled:opacity-50">
                {t('purchasing.submitSignatureCancel')}
              </button>
              <button type="button" disabled={submitting || !signature || !form.requesterName.trim()} onClick={handleConfirmSignature}
                className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {t('purchasing.submitSignatureConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPmSignDialog && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !submitting && setShowPmSignDialog(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0a0e17] border border-[#c8a96e]/25 rounded-2xl p-6 sm:p-7 space-y-5"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            dir={isRTL ? 'rtl' : 'ltr'}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(200,169,110,0.12)' }}>
                  <PenLine size={18} className="text-[#c8a96e]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">{t('purchasing.pmSignatureDialogTitle')}</h2>
                  <p className="text-xs text-white/45 mt-1">{t('purchasing.pmSignatureDialogDesc')}</p>
                </div>
              </div>
              <button type="button" disabled={submitting} onClick={() => setShowPmSignDialog(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all shrink-0 disabled:opacity-40">
                <X size={14} />
              </button>
            </div>

            <div>
              <label className={labelCls}>{t('purchasing.pmNameLabel')}</label>
              <input className={inputCls} value={pmName} onChange={e => setPmName(e.target.value)} />
            </div>

            <SignaturePad onChange={setPmSignature} defaultName={pmName} />

            {pmSignError && <div className="rounded-xl px-4 py-2.5 text-xs bg-red-500/10 border border-red-500/25 text-red-400">{pmSignError}</div>}

            <div className="flex gap-2.5">
              <button type="button" disabled={submitting} onClick={() => setShowPmSignDialog(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white/60 border border-white/10 hover:text-white hover:border-white/20 transition-all disabled:opacity-50">
                {t('purchasing.submitSignatureCancel')}
              </button>
              <button type="button" disabled={submitting || !pmSignature || !pmName.trim()} onClick={handleConfirmPmSignature}
                className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
                {submitting && <Loader2 size={15} className="animate-spin" />}
                {t('purchasing.submitSignatureConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

/* ─────────────────────────── Delivery confirmation (requester side) ─────────────────────────── */
function DeliveryConfirmSection({ request, user }) {
  const { t, isRTL } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const confirmDelivery = async () => {
    if (photos.length === 0) { setError(t('purchasing.deliveryProofRequired')); return; }
    setError('');
    setSubmitting(true);
    try {
      const actorName = request.requesterName || user.displayName || user.email;
      await updateDoc(doc(db, 'purchaseRequests', request.id), {
        status: STATUS.RECEIVED,
        deliveryProof: photos,
        deliveryConfirmedAt: serverTimestamp(),
        deliveryConfirmedByUid: user.uid,
        deliveryConfirmedByName: actorName,
        updatedAt: serverTimestamp(),
      });
      await addHistoryEntry(request.id, {
        userId: user.uid, userName: actorName, role: ROLES.SITE_SUPERVISOR,
        action: 'received', previousStatus: STATUS.APPROVED, newStatus: STATUS.RECEIVED, notes: '',
      });
      await notify({
        targetRole: ROLES.PROCUREMENT_MANAGER, type: 'received',
        requestId: request.id, requestNumber: request.requestNumber,
        title: t('purchasing.notifReceivedTitle'), message: `${request.requestNumber} — ${request.projectName}`,
      });
    } catch (err) {
      setError(err.message || t('purchasing.actionFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <p className="text-sm font-bold text-white">{t('purchasing.deliveryProofTitle')}</p>
        <p className="text-xs text-white/45 mt-0.5">{t('purchasing.deliveryProofDesc')}</p>
      </div>
      <AttachmentsUploader pathPrefix={`purchaseRequests/${request.id}/delivery`} attachments={photos} onChange={setPhotos} />
      {error && <div className="rounded-lg px-3 py-2 text-xs bg-red-500/10 border border-red-500/25 text-red-400">{error}</div>}
      <button type="button" disabled={submitting || photos.length === 0} onClick={confirmDelivery}
        className="w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg,#8a6a1e,#D5B25D,#e8c96e,#D5B25D,#8a6a1e)', color: '#000' }}>
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {t('purchasing.deliveryConfirmButton')}
      </button>
    </div>
  );
}

/* ─────────────────────────── My requests list ─────────────────────────── */
function MyRequests({ user, onEdit }) {
  const { t, isRTL } = useLanguage();
  const [requests, setRequests] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'purchaseRequests'), where('requesterUid', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setRequests(docs);
    });
    return unsub;
  }, [user.uid]);

  if (requests === null) return <div className="flex justify-center py-16"><Loader2 size={26} className="animate-spin text-[#c8a96e]" /></div>;
  if (requests.length === 0) return <p className="text-center text-white/30 py-16">{t('purchasing.noRequestsYet')}</p>;

  return (
    <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      {requests.map(r => {
        const open = openId === r.id;
        return (
          <div key={r.id} className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setOpenId(open ? null : r.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-start">
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate" dir="ltr">{r.requestNumber}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{r.projectName} · {r.siteName}</p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <PurchaseStatusBadge status={r.status} />
                {open ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
              </div>
            </button>
            {open && (
              <div className="px-4 pb-4 pt-1 border-t border-white/[0.06] space-y-4">
                {r.status === STATUS.RETURNED && (
                  <button type="button" onClick={() => onEdit(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 border border-amber-500/30 hover:bg-amber-500/10">
                    <Pencil size={12} /> {t('purchasing.editAndResubmit')}
                  </button>
                )}
                {r.status === STATUS.APPROVED && <DeliveryConfirmSection request={r} user={user} />}
                <ApprovalTimeline requestId={r.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */
export default function PurchaseRequestPage() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const { loading: roleLoading, profile, hasAccess } = usePurchasingRole();
  const [tab, setTab] = useState('new');
  const [editingRequest, setEditingRequest] = useState(null);

  if (user === undefined || (user && roleLoading)) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center"><Loader2 size={30} className="animate-spin text-[#c8a96e]" /></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <InlineLogin />
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <section className="min-h-[60vh] flex items-center justify-center px-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="text-center max-w-md">
            <ShieldAlert size={36} className="text-amber-400 mx-auto mb-4" />
            <h1 className="text-lg font-bold text-white mb-2">{t('purchasing.accountNotProvisionedTitle')}</h1>
            <p className="text-sm text-white/45">{t('purchasing.accountNotProvisionedDesc')}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="pt-36 lg:pt-40 pb-16 px-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[#c8a96e] font-bold tracking-widest text-xs mb-2 block">{t('purchasing.portalBadge')}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{t('purchasing.portalTitle')}</h1>
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit mx-auto mb-8">
            <button onClick={() => { setTab('new'); setEditingRequest(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'new' ? 'bg-[#c8a96e] text-black' : 'text-white/45 hover:text-white'}`}>
              <FileText size={13} /> {t('purchasing.newRequestTab')}
            </button>
            <button onClick={() => { setTab('mine'); setEditingRequest(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'mine' ? 'bg-[#c8a96e] text-black' : 'text-white/45 hover:text-white'}`}>
              <ListChecks size={13} /> {t('purchasing.myRequestsTab')}
            </button>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8">
            {tab === 'new' || editingRequest ? (
              <RequestForm
                profile={profile} user={user} editingRequest={editingRequest}
                onDone={() => { setEditingRequest(null); setTab('mine'); }}
              />
            ) : (
              <MyRequests user={user} onEdit={(r) => setEditingRequest(r)} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
