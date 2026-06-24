'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  collection, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import {
  Search, Trash2, Loader2, Eye, MessageSquare, X, Send,
  Mail, Phone, Building2, User, Calendar, Tag, Clock,
  CheckCircle, XCircle, ChevronDown, FileText, CornerUpLeft,
} from 'lucide-react';

/* ── Status system ── */
const STATUS_CONFIG = {
  new:          { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',   labelAr: 'جديدة',         labelEn: 'New' },
  under_review: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  labelAr: 'قيد المراجعة',   labelEn: 'Under Review' },
  replied:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  labelAr: 'تم الرد',        labelEn: 'Replied' },
  closed:       { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', labelAr: 'مغلقة',          labelEn: 'Closed' },
};
const STATUS_KEYS = ['all', 'new', 'under_review', 'replied', 'closed'];

const SUBJECT_LABELS = {
  construction: { ar: 'مقاولات البناء',    en: 'Construction' },
  architecture:  { ar: 'التصميم المعماري', en: 'Architecture' },
  management:    { ar: 'إدارة المشاريع',   en: 'Project Management' },
  other:         { ar: 'أخرى',            en: 'Other' },
};

function StatusChip({ status, lang }) {
  const cfg   = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  const label = lang === 'ar' ? cfg.labelAr : cfg.labelEn;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
      {label}
    </span>
  );
}

/* ── Main page ── */
export default function MessagesPage() {
  const { lang, isRTL } = useLanguage();
  const L = (ar, en) => lang === 'ar' ? ar : en;

  const [messages, setMessages]     = useState([]);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState(null);

  /* View modal */
  const [viewMsg, setViewMsg] = useState(null);

  /* Reply modal */
  const [replyMsg, setReplyMsg]         = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText]       = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError]     = useState('');
  const [replyDone, setReplyDone]       = useState(false);

  /* Real-time listener */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'contacts'), snap => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setMessages(docs);
      setLoading(false);
    });
    return unsub;
  }, []);

  /* Filtered list */
  const visible = useMemo(() => {
    const now    = Date.now();
    const dayMs  = 86400000;
    const weekMs = 7 * dayMs;
    const monMs  = 30 * dayMs;

    return messages.filter(m => {
      if (filter !== 'all' && (m.status || 'new') !== filter) return false;
      if (dateFilter !== 'all') {
        const ms = (m.createdAt?.seconds ?? 0) * 1000;
        if (dateFilter === 'today' && now - ms > dayMs)  return false;
        if (dateFilter === 'week'  && now - ms > weekMs) return false;
        if (dateFilter === 'month' && now - ms > monMs)  return false;
      }
      const q = search.toLowerCase();
      if (q) {
        const name  = (m.fullName || m.name || '').toLowerCase();
        const email = (m.email || '').toLowerCase();
        const phone = (m.phone || '');
        if (!name.includes(q) && !email.includes(q) && !phone.includes(q)) return false;
      }
      return true;
    });
  }, [messages, filter, search, dateFilter]);

  /* Stats */
  const counts = useMemo(() => {
    const c = { total: messages.length, new: 0, under_review: 0, replied: 0, closed: 0 };
    messages.forEach(m => {
      const s = m.status || 'new';
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [messages]);

  /* Actions */
  const updateStatus = async (id, status) => {
    setActionId(id + status);
    await updateDoc(doc(db, 'contacts', id), { status, updatedAt: serverTimestamp() });
    setActionId(null);
    if (viewMsg?.id === id) setViewMsg(v => v ? { ...v, status } : v);
  };

  const deleteMsg = async (id) => {
    if (!confirm(L('هل أنت متأكد من حذف هذه الرسالة؟', 'Delete this message?'))) return;
    await deleteDoc(doc(db, 'contacts', id));
    if (viewMsg?.id  === id) setViewMsg(null);
    if (replyMsg?.id === id) setReplyMsg(null);
  };

  const openReply = (msg) => {
    const subj = SUBJECT_LABELS[msg.subject]?.[lang] || msg.subject || '';
    setReplyMsg(msg);
    setReplySubject(`${L('رد على رسالتك', 'Re: Your Message')}${subj ? ` — ${subj}` : ''}`);
    setReplyText(msg.adminReply || '');
    setReplyError('');
    setReplyDone(false);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !replyMsg?.email) return;
    setReplySending(true);
    setReplyError('');
    try {
      const res  = await fetch('/api/send-contact-reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:  replyMsg.fullName || replyMsg.name,
          customerEmail: replyMsg.email,
          subject:       replySubject,
          replyMessage:  replyText,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Send failed');
      await updateDoc(doc(db, 'contacts', replyMsg.id), {
        status:     'replied',
        adminReply: replyText,
        updatedAt:  serverTimestamp(),
      });
      setReplyDone(true);
      setTimeout(() => { setReplyMsg(null); setReplyDone(false); }, 2200);
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setReplySending(false);
    }
  };

  const saveDraft = async () => {
    if (!replyText.trim() || !replyMsg) return;
    await updateDoc(doc(db, 'contacts', replyMsg.id), {
      adminReply: replyText,
      updatedAt:  serverTimestamp(),
    });
    setReplyMsg(null);
  };

  const fmt     = ts => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB') : '—';
  const fmtFull = ts => ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-GB') : '—';
  const subjectLabel = s => SUBJECT_LABELS[s]?.[lang] || s || '—';

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center">
            <MessageSquare size={16} className="text-[#c8a96e]" />
          </div>
          <h1 className="text-2xl font-bold text-white">{L('رسائل العملاء', 'Customer Messages')}</h1>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: L('إجمالي الرسائل', 'Total Messages'), value: counts.total,        color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
            { label: L('رسائل جديدة',    'New Messages'),    value: counts.new,           color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
            { label: L('تم الرد عليها',  'Replied'),         value: counts.replied,       color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
            { label: L('مغلقة',          'Closed'),          value: counts.closed,        color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4 text-center">
              <p className="text-2xl font-black" style={{ color }}>{value}</p>
              <p className="text-white/35 text-[11px] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={L('بحث بالاسم أو البريد...', 'Search by name or email...')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40`}
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap items-center">
            {STATUS_KEYS.map(s => {
              const cfg   = STATUS_CONFIG[s];
              const label = s === 'all'
                ? L('الكل', 'All')
                : (lang === 'ar' ? cfg?.labelAr : cfg?.labelEn) || s;
              return (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    filter === s
                      ? 'bg-[#c8a96e]/15 text-[#c8a96e] border border-[#c8a96e]/30'
                      : 'text-white/40 border border-white/8 hover:text-white/70'
                  }`}>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Date filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className={`bg-white/5 border border-white/10 rounded-xl py-2.5 ${isRTL ? 'pr-3 pl-9' : 'pl-3 pr-9'} text-white text-xs focus:outline-none focus:border-[#c8a96e]/40 appearance-none cursor-pointer`}
            >
              <option value="all"   className="bg-black">{L('كل الأوقات', 'All Time')}</option>
              <option value="today" className="bg-black">{L('اليوم',       'Today')}</option>
              <option value="week"  className="bg-black">{L('هذا الأسبوع', 'This Week')}</option>
              <option value="month" className="bg-black">{L('هذا الشهر',   'This Month')}</option>
            </select>
            <ChevronDown size={12} className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-white/30 pointer-events-none`} />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 size={28} className="text-[#c8a96e] animate-spin" /></div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 text-white/25 text-sm">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
            {L('لا توجد رسائل', 'No messages found')}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      L('الاسم / البريد', 'Name / Email'),
                      L('الهاتف',         'Phone'),
                      L('الموضوع',        'Subject'),
                      L('التاريخ',        'Date'),
                      L('الحالة',         'Status'),
                      L('الإجراءات',      'Actions'),
                    ].map(h => (
                      <th key={h} className="px-4 py-3 text-white/35 font-semibold text-xs text-start">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {visible.map(msg => (
                    <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name + Email */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{msg.fullName || msg.name || '—'}</p>
                        <p className="text-white/35 text-xs mt-0.5">{msg.email || '—'}</p>
                      </td>
                      {/* Phone */}
                      <td className="px-4 py-3.5 text-white/50 text-xs">{msg.phone || '—'}</td>
                      {/* Subject */}
                      <td className="px-4 py-3.5 text-white/75 text-xs max-w-[130px] truncate">
                        {subjectLabel(msg.subject)}
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3.5 text-white/35 text-xs" dir="ltr">{fmt(msg.createdAt)}</td>
                      {/* Status */}
                      <td className="px-4 py-3.5"><StatusChip status={msg.status || 'new'} lang={lang} /></td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewMsg(msg)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
                            title={L('عرض', 'View')}>
                            <Eye size={14} />
                          </button>
                          {msg.email && (
                            <button onClick={() => openReply(msg)}
                              className="p-1.5 rounded-lg text-white/30 hover:text-[#c8a96e] hover:bg-[#c8a96e]/8 transition-all"
                              title={L('رد', 'Reply')}>
                              <CornerUpLeft size={14} />
                            </button>
                          )}
                          {(msg.status || 'new') !== 'under_review' && (msg.status || 'new') !== 'replied' && (msg.status || 'new') !== 'closed' && (
                            <button onClick={() => updateStatus(msg.id, 'under_review')}
                              className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/8 transition-all"
                              title={L('قيد المراجعة', 'Under Review')}>
                              {actionId === msg.id + 'under_review'
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Clock size={14} />}
                            </button>
                          )}
                          {(msg.status || 'new') !== 'closed' && (
                            <button onClick={() => updateStatus(msg.id, 'closed')}
                              className="p-1.5 rounded-lg text-white/30 hover:text-gray-400 hover:bg-gray-500/8 transition-all"
                              title={L('إغلاق', 'Close')}>
                              {actionId === msg.id + 'closed'
                                ? <Loader2 size={14} className="animate-spin" />
                                : <XCircle size={14} />}
                            </button>
                          )}
                          <button onClick={() => deleteMsg(msg.id)}
                            className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/8 transition-all"
                            title={L('حذف', 'Delete')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            VIEW MODAL
        ══════════════════════════════════════════ */}
        {viewMsg && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.78)' }}
            onClick={() => setViewMsg(null)}
          >
            <div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background:  '#0a0e17',
                border:      '1px solid rgba(201,163,77,0.18)',
                boxShadow:   '0 24px 80px rgba(0,0,0,0.95)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <MessageSquare size={15} className="text-[#c8a96e]" />
                  <h2 className="text-base font-bold text-white">{L('تفاصيل الرسالة', 'Message Details')}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={viewMsg.status || 'new'} lang={lang} />
                  <button onClick={() => setViewMsg(null)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: User,      color: '#c8a96e', bg: 'rgba(200,169,110,0.10)', label: L('الاسم الكامل', 'Full Name'),   val: viewMsg.fullName || viewMsg.name || '—' },
                    { icon: Mail,      color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  label: L('البريد الإلكتروني', 'Email'),  val: viewMsg.email   || '—' },
                    { icon: Phone,     color: '#10b981', bg: 'rgba(16,185,129,0.10)',  label: L('رقم الهاتف', 'Phone'),         val: viewMsg.phone   || '—' },
                    { icon: Building2, color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', label: L('الشركة', 'Company'),          val: viewMsg.company || '—' },
                    { icon: Tag,       color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  label: L('الموضوع', 'Subject'),         val: subjectLabel(viewMsg.subject) },
                    { icon: Calendar,  color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: L('التاريخ', 'Date'),            val: fmtFull(viewMsg.createdAt) },
                  ].map(({ icon: Icon, color, bg, label, val }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg, border: `1px solid ${color}20` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-white font-semibold text-sm truncate">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full Message */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">{L('الرسالة', 'Message')}</p>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{viewMsg.message || '—'}</p>
                </div>

                {/* Admin Reply */}
                {viewMsg.adminReply && (
                  <div className="bg-[#c8a96e]/5 border border-[#c8a96e]/18 rounded-xl p-4">
                    <p className="text-[10px] text-[#c8a96e]/55 uppercase tracking-wider mb-3">{L('رد الإدارة', 'Admin Reply')}</p>
                    <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">{viewMsg.adminReply}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 flex-wrap pt-1 border-t border-white/[0.06]">
                  {viewMsg.email && (
                    <button onClick={() => { setViewMsg(null); openReply(viewMsg); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] hover:bg-[#c8a96e]/18">
                      <CornerUpLeft size={12} /> {L('رد على الرسالة', 'Reply')}
                    </button>
                  )}
                  {(viewMsg.status || 'new') !== 'under_review' && (
                    <button onClick={() => updateStatus(viewMsg.id, 'under_review')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/18">
                      <Clock size={12} /> {L('قيد المراجعة', 'Under Review')}
                    </button>
                  )}
                  {(viewMsg.status || 'new') !== 'closed' && (
                    <button onClick={() => updateStatus(viewMsg.id, 'closed')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:bg-gray-500/18">
                      <XCircle size={12} /> {L('إغلاق', 'Close')}
                    </button>
                  )}
                  <button onClick={() => deleteMsg(viewMsg.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/18 ms-auto">
                    <Trash2 size={12} /> {L('حذف', 'Delete')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            REPLY MODAL
        ══════════════════════════════════════════ */}
        {replyMsg && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.78)' }}
            onClick={() => !replySending && setReplyMsg(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl overflow-hidden"
              style={{
                background: '#0a0e17',
                border:     '1px solid rgba(201,163,77,0.18)',
                boxShadow:  '0 24px 80px rgba(0,0,0,0.95)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <CornerUpLeft size={15} className="text-[#c8a96e]" />
                  <h2 className="text-base font-bold text-white">{L('إرسال رد', 'Send Reply')}</h2>
                </div>
                <button onClick={() => !replySending && setReplyMsg(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all">
                  <X size={14} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {replyDone ? (
                  <div className="text-center py-8">
                    <CheckCircle size={42} className="text-green-400 mx-auto mb-3" />
                    <p className="text-white font-bold text-base">{L('تم الإرسال بنجاح!', 'Reply sent successfully!')}</p>
                    <p className="text-white/40 text-xs mt-1">{L('تم تحديث حالة الرسالة إلى "تم الرد"', 'Status updated to Replied')}</p>
                  </div>
                ) : (
                  <>
                    {/* To */}
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">{L('إلى', 'To')}</p>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                        <Mail size={13} className="text-white/30 shrink-0" />
                        <span className="text-white/65 text-sm">{replyMsg.fullName || replyMsg.name} &lt;{replyMsg.email}&gt;</span>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">{L('الموضوع', 'Subject')}</p>
                      <input
                        value={replySubject}
                        onChange={e => setReplySubject(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c8a96e]/40 focus:outline-none"
                      />
                    </div>

                    {/* Reply text */}
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">{L('الرد', 'Reply Message')}</p>
                      <textarea
                        rows={5}
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={L('اكتب ردك هنا...', 'Write your reply here...')}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#c8a96e]/40 focus:outline-none resize-none placeholder:text-white/20"
                      />
                    </div>

                    {replyError && <p className="text-red-400 text-xs text-center">{replyError}</p>}

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={sendReply}
                        disabled={replySending || !replyText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-[#c8a96e] to-[#E1BF67] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {replySending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        {replySending ? L('جاري الإرسال...', 'Sending...') : L('إرسال الرد', 'Send Reply')}
                      </button>
                      <button
                        onClick={saveDraft}
                        disabled={replySending || !replyText.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white/5 border border-white/10 text-white/55 hover:text-white hover:bg-white/10 disabled:opacity-40"
                      >
                        <FileText size={13} /> {L('حفظ مسودة', 'Save Draft')}
                      </button>
                      <button
                        onClick={() => !replySending && setReplyMsg(null)}
                        disabled={replySending}
                        className="px-3 py-2.5 rounded-xl text-xs font-bold text-white/35 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {L('إلغاء', 'Cancel')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminPageLayout>
  );
}
