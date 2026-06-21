'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import {
  Search, Trash2, CheckCircle, XCircle, Loader2,
  X, Calendar, MapPin, Phone, Mail, Briefcase, User,
  FileText, Clock, Send, ChevronDown,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:              { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  labelKey: 'admin.statusPending' },
  interview_scheduled:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  labelKey: 'admin.statusInterviewScheduled' },
  rejected:             { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   labelKey: 'admin.statusRejected' },
};

const STATUS_FILTERS = ['all', 'pending', 'interview_scheduled', 'rejected'];

function StatusChip({ status, t }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
      {t(cfg.labelKey)}
    </span>
  );
}

export default function JobsPage() {
  const { t, isRTL } = useLanguage();
  const [apps, setApps]           = useState([]);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null);

  // Accept dialog state
  const [dialogApp, setDialogApp]             = useState(null);
  const [interviewDate, setInterviewDate]     = useState('');
  const [interviewTime, setInterviewTime]     = useState('');
  const [interviewType, setInterviewType]     = useState('in_person');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [sending, setSending]     = useState(false);
  const [sendStatus, setSendStatus] = useState(''); // 'success' | 'error'
  const [sendError, setSendError]   = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jobApplications'), snap => {
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
      setApps(docs);
      setLoading(false);
    });
    return unsub;
  }, []);

  const visible = apps.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.fullName?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.position?.toLowerCase().includes(q) ||
      a.phone?.includes(q);
    return matchStatus && matchSearch;
  });

  const rejectApp = async (id, name) => {
    if (!confirm(t('admin.rejectJobConfirm'))) return;
    setActionId(id + 'reject');
    await updateDoc(doc(db, 'jobApplications', id), { status: 'rejected', reviewedAt: new Date() });
    setActionId(null);
  };

  const deleteApp = async (id, name) => {
    if (!confirm(t('admin.deleteJobConfirm'))) return;
    await deleteDoc(doc(db, 'jobApplications', id));
  };

  const openDialog = (app) => {
    setDialogApp(app);
    setInterviewDate('');
    setInterviewTime('');
    setInterviewType('in_person');
    setInterviewLocation('');
    setAdditionalMessage('');
    setSendStatus('');
    setSendError('');
  };

  const closeDialog = () => {
    setDialogApp(null);
    setSendStatus('');
    setSendError('');
  };

  const handleSendAcceptance = async () => {
    if (!interviewDate || !interviewTime) return;
    setSending(true);
    setSendStatus('');
    setSendError('');
    try {
      const res = await fetch('/api/send-interview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName:    dialogApp.fullName,
          applicantEmail:   dialogApp.email,
          position:         dialogApp.position,
          interviewDate,
          interviewTime,
          interviewType,
          interviewLocation,
          additionalMessage,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.code || 'Unknown error');

      await updateDoc(doc(db, 'jobApplications', dialogApp.id), {
        status: 'interview_scheduled',
        reviewedAt: new Date(),
        interviewDetails: { interviewDate, interviewTime, interviewType, interviewLocation, additionalMessage, sentAt: new Date() },
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
          <h1 className="text-2xl font-bold text-white">{t('admin.jobsTitle')}</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('admin.searchJobsPlaceholder')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40`} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-[#c8a96e]/15 text-[#c8a96e] border border-[#c8a96e]/30' : 'text-white/40 border border-white/8 hover:text-white/70'}`}>
                {s === 'all' ? t('admin.allStatuses') : t(STATUS_CONFIG[s]?.labelKey || s)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 size={28} className="text-[#c8a96e] animate-spin" /></div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24 text-white/25 text-sm">{t('admin.noJobs')}</div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[t('admin.applicantName'), t('admin.positionApplied'), t('admin.experienceYears'), 'Email', t('admin.submittedCol'), t('admin.statusCol'), t('admin.actionsCol')].map(h => (
                      <th key={h} className="px-4 py-3 text-white/35 font-semibold text-xs text-start">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {visible.map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-white">{app.fullName}</p>
                        <p className="text-white/35 text-xs mt-0.5">{app.phone}</p>
                      </td>
                      <td className="px-4 py-3.5 text-white/75">{app.position}</td>
                      <td className="px-4 py-3.5 text-white/50 text-xs">{app.experience || '—'}</td>
                      <td className="px-4 py-3.5 text-white/50 text-xs">{app.email}</td>
                      <td className="px-4 py-3.5 text-white/35 text-xs" dir="ltr">
                        {app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="px-4 py-3.5"><StatusChip status={app.status} t={t} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* CV */}
                          {app.cvUrl && (
                            <a href={app.cvUrl} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all" title={t('admin.viewCV')}>
                              <FileText size={14} />
                            </a>
                          )}
                          {/* Accept */}
                          {app.status !== 'interview_scheduled' && app.status !== 'rejected' && (
                            <button onClick={() => openDialog(app)}
                              className="p-1.5 rounded-lg text-green-400/60 hover:text-green-400 hover:bg-green-500/8 transition-all" title={t('admin.scheduleInterview')}>
                              {actionId === app.id + 'accept' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                            </button>
                          )}
                          {/* Reject */}
                          {app.status !== 'rejected' && (
                            <button onClick={() => rejectApp(app.id, app.fullName)}
                              className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all" title={t('admin.reject')}>
                              {actionId === app.id + 'reject' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                            </button>
                          )}
                          {/* Delete */}
                          <button onClick={() => deleteApp(app.id, app.fullName)}
                            className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/8 transition-all" title={t('admin.delete')}>
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
      </div>

      {/* ===== ACCEPT / INTERVIEW DIALOG ===== */}
      {dialogApp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Dialog header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#0d0d14]">
              <div>
                <h2 className="text-white font-bold text-base">{t('admin.scheduleInterview')}</h2>
                <p className="text-white/40 text-xs mt-0.5">{dialogApp.fullName} — {dialogApp.position}</p>
              </div>
              <button onClick={closeDialog} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Applicant info */}
            <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Mail size={12} className="text-[#c8a96e]" />
                {dialogApp.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Phone size={12} className="text-[#c8a96e]" />
                {dialogApp.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Briefcase size={12} className="text-[#c8a96e]" />
                {dialogApp.position}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Clock size={12} className="text-[#c8a96e]" />
                {dialogApp.experience || '—'}
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.interviewDate')} *</label>
                  <input type="date" required value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#c8a96e]/50 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.interviewTime')} *</label>
                  <input type="time" required value={interviewTime} onChange={e => setInterviewTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#c8a96e]/50 outline-none transition-all" />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.interviewType')}</label>
                <div className="relative">
                  <select value={interviewType} onChange={e => setInterviewType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#c8a96e]/50 outline-none transition-all appearance-none cursor-pointer">
                    <option value="in_person" className="bg-[#111]">{t('admin.inPerson')}</option>
                    <option value="video"     className="bg-[#111]">{t('admin.videoCall')}</option>
                    <option value="phone"     className="bg-[#111]">{t('admin.phoneCall')}</option>
                  </select>
                  <ChevronDown size={13} className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-white/30 pointer-events-none`} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.interviewLocation')}</label>
                <input type="text" value={interviewLocation} onChange={e => setInterviewLocation(e.target.value)}
                  placeholder={interviewType === 'in_person' ? 'مثال: مقر الشركة — جدة' : interviewType === 'video' ? 'رابط Google Meet / Zoom' : 'رقم الهاتف للتواصل'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all" />
              </div>

              {/* Additional message */}
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.additionalMessage')}</label>
                <textarea rows={3} value={additionalMessage} onChange={e => setAdditionalMessage(e.target.value)}
                  placeholder="أي تعليمات أو معلومات إضافية للمتقدم..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all resize-none" />
              </div>

              {/* Status messages */}
              {sendStatus === 'success' && (
                <p className="text-green-400 text-sm font-semibold text-center">{t('admin.emailSentSuccess')}</p>
              )}
              {sendStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm font-semibold text-center mb-1">{t('admin.emailSentError')}</p>
                  {sendError && <p className="text-red-300/70 text-xs text-center break-all">{sendError}</p>}
                </div>
              )}
            </div>

            {/* Dialog footer */}
            <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
              <button onClick={closeDialog}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:text-white hover:border-white/20 transition-all">
                {t('admin.back')}
              </button>
              <button onClick={handleSendAcceptance} disabled={sending || !interviewDate || !interviewTime}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a96e] to-[#B8923A] text-black text-sm font-black flex items-center justify-center gap-2 hover:from-[#D5B25D] hover:to-[#c8a96e] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {t('admin.sendAcceptance')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
