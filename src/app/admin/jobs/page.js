'use client';
import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Link from 'next/link';
import {
  Search, Trash2, CheckCircle, XCircle, Loader2,
  X, Phone, Mail, Briefcase, FileText, Clock,
  Send, ChevronDown, Eye, MapPin, Sparkles, Download,
  Star, CalendarCheck, Calendar,
} from 'lucide-react';

/* ─── Status config ─── */
const STATUS_CONFIG = {
  pending:             { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  labelKey: 'admin.statusPending' },
  interview_scheduled: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', labelKey: 'admin.statusInterviewScheduled' },
  rejected:            { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  labelKey: 'admin.statusRejected' },
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

/* ─── Smart Agent scoring ─── */
const CLOSE_CITIES  = ['جدة','jeddah','مكة','mecca','الطائف','taif','رابغ','rabigh','ينبع','yanbu','القنفذة'];
const MEDIUM_CITIES = ['الرياض','riyadh','المدينة','medina','الدمام','dammam','الخبر','khobar','أبها','abha'];

const EXP_SCORES = {
  'أقل من سنة':       5,  'Less than 1 year': 5,
  '1 – 3 سنوات':     15,  '1 – 3 years':      15,
  '3 – 5 سنوات':     35,  '3 – 5 years':      35,
  '5 – 10 سنوات':    55,  '5 – 10 years':     55,
  'أكثر من 10 سنوات':75,  'More than 10 years':75,
};

function scoreApp(app) {
  const expScore  = EXP_SCORES[app.experience] ?? 0;
  const cityLower = (app.city || '').toLowerCase();
  const cityScore = CLOSE_CITIES.some(c  => cityLower.includes(c.toLowerCase())) ? 50
                  : MEDIUM_CITIES.some(c => cityLower.includes(c.toLowerCase())) ? 25
                  : cityLower.length > 1 ? 5 : 0;
  return { expScore, cityScore, total: expScore + cityScore,
           isBestMatch: expScore >= 35 && cityScore >= 50 };
}

/* ─── Main page ─── */
export default function JobsPage() {
  const { t, isRTL } = useLanguage();
  const [apps, setApps]           = useState([]);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null);
  const [agentOn, setAgentOn]     = useState(false);

  /* View dialog */
  const [viewApp, setViewApp]     = useState(null);

  /* Accept dialog */
  const [dialogApp, setDialogApp]                   = useState(null);
  const [interviewDate, setInterviewDate]           = useState('');
  const [interviewTime, setInterviewTime]           = useState('');
  const [interviewType, setInterviewType]           = useState('in_person');
  const [interviewLocation, setInterviewLocation]   = useState('');
  const [additionalMessage, setAdditionalMessage]   = useState('');
  const [sending, setSending]     = useState(false);
  const [sendStatus, setSendStatus] = useState('');
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

  const visible = useMemo(() => {
    let list = apps.filter(a => {
      const matchStatus = filter === 'all' || a.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        a.fullName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.position?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q) ||
        a.phone?.includes(q);
      return matchStatus && matchSearch;
    });
    if (agentOn) {
      list = [...list].sort((a, b) => scoreApp(b).total - scoreApp(a).total);
    }
    return list;
  }, [apps, filter, search, agentOn]);

  const rejectApp = async (id) => {
    if (!confirm(t('admin.rejectJobConfirm'))) return;
    setActionId(id + 'reject');
    await updateDoc(doc(db, 'jobApplications', id), { status: 'rejected', reviewedAt: new Date() });
    setActionId(null);
  };

  const deleteApp = async (id) => {
    if (!confirm(t('admin.deleteJobConfirm'))) return;
    await deleteDoc(doc(db, 'jobApplications', id));
  };

  const openDialog = (app) => {
    setDialogApp(app);
    setInterviewDate(''); setInterviewTime('');
    setInterviewType('in_person'); setInterviewLocation('');
    setAdditionalMessage(''); setSendStatus(''); setSendError('');
  };

  const closeDialog   = () => { setDialogApp(null); setSendStatus(''); setSendError(''); };
  const closeViewDialog = () => setViewApp(null);

  const handleSendAcceptance = async () => {
    if (!interviewDate || !interviewTime) return;
    setSending(true); setSendStatus(''); setSendError('');
    try {
      const res  = await fetch('/api/send-interview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: dialogApp.fullName, applicantEmail: dialogApp.email,
          position: dialogApp.position, interviewDate, interviewTime,
          interviewType, interviewLocation, additionalMessage,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || data.code || 'Unknown error');
      await updateDoc(doc(db, 'jobApplications', dialogApp.id), {
        status: 'interview_scheduled', reviewedAt: new Date(),
        interviewDetails: { interviewDate, interviewTime, interviewType, interviewLocation, additionalMessage, sentAt: new Date() },
      });
      setSendStatus('success');
      setTimeout(() => closeDialog(), 2000);
    } catch (err) {
      setSendStatus('error'); setSendError(err.message || 'Unknown error');
    } finally {
      setSending(false);
    }
  };

  /* stats */
  const totalPending  = apps.filter(a => a.status === 'pending').length;
  const totalAccepted = apps.filter(a => a.status === 'interview_scheduled').length;
  const bestMatches   = apps.filter(a => scoreApp(a).isBestMatch).length;

  return (
    <AdminPageLayout>
      <div className="p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-white">{t('admin.jobsTitle')}</h1>
          <Link href="/admin/jobs/approved"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] text-xs font-bold hover:bg-[#c8a96e]/18 transition-all">
            <CalendarCheck size={14} />
            المقبولون ({totalAccepted})
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'طلبات جديدة', value: totalPending, color: '#3b82f6' },
            { label: 'مقبولون',     value: totalAccepted, color: '#f59e0b' },
            { label: 'أفضل مرشح',  value: bestMatches,   color: '#c8a96e', icon: <Star size={11} /> },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4 text-center">
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-white/35 text-[11px] mt-1 flex items-center justify-center gap-1">{s.icon}{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Agent toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('admin.searchJobsPlaceholder')}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-2.5 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40`} />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-[#c8a96e]/15 text-[#c8a96e] border border-[#c8a96e]/30' : 'text-white/40 border border-white/8 hover:text-white/70'}`}>
                {s === 'all' ? t('admin.allStatuses') : t(STATUS_CONFIG[s]?.labelKey || s)}
              </button>
            ))}
            {/* Smart Agent toggle */}
            <button onClick={() => setAgentOn(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${agentOn ? 'bg-purple-500/15 text-purple-300 border-purple-500/35' : 'text-white/40 border-white/8 hover:text-purple-300/70'}`}>
              <Sparkles size={12} />
              الترتيب الذكي
            </button>
          </div>
        </div>

        {/* Agent info banner */}
        {agentOn && (
          <div className="flex items-start gap-3 bg-purple-500/8 border border-purple-500/20 rounded-xl px-4 py-3 mb-4">
            <Sparkles size={14} className="text-purple-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-purple-300 text-xs font-bold mb-0.5">الذكاء الاصطناعي مفعّل</p>
              <p className="text-white/40 text-xs leading-relaxed">يتم ترتيب المتقدمين تلقائياً بناءً على <strong className="text-white/60">سنوات الخبرة</strong> و<strong className="text-white/60">قرب المدينة</strong>. المتقدمون الذين يحققون الشرطين معاً يظهرون أولاً بشارة ⭐</p>
            </div>
          </div>
        )}

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
                    {['المتقدم', 'الوظيفة', 'الخبرة', 'المدينة', 'التاريخ', 'الحالة', 'الإجراءات'].map(h => (
                      <th key={h} className="px-4 py-3 text-white/35 font-semibold text-xs text-start">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {visible.map(app => {
                    const sc = scoreApp(app);
                    return (
                      <tr key={app.id} className={`hover:bg-white/[0.02] transition-colors ${agentOn && sc.isBestMatch ? 'bg-purple-500/[0.03]' : ''}`}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {agentOn && sc.isBestMatch && (
                              <span className="text-[10px] font-black text-purple-300 bg-purple-500/15 border border-purple-500/25 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shrink-0">
                                <Star size={8} className="fill-purple-300" /> أفضل
                              </span>
                            )}
                            <div>
                              <p className="font-semibold text-white">{app.fullName}</p>
                              <p className="text-white/35 text-xs mt-0.5">{app.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-white/75 text-xs max-w-[140px] truncate">{app.position}</td>
                        <td className="px-4 py-3.5 text-white/50 text-xs">{app.experience || '—'}</td>
                        <td className="px-4 py-3.5 text-white/50 text-xs">{app.city || '—'}</td>
                        <td className="px-4 py-3.5 text-white/35 text-xs" dir="ltr">
                          {app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="px-4 py-3.5"><StatusChip status={app.status} t={t} /></td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            {/* View */}
                            <button onClick={() => setViewApp(app)}
                              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all" title="عرض التفاصيل">
                              <Eye size={14} />
                            </button>
                            {/* CV */}
                            {app.cvUrl && (
                              <a href={app.cvUrl} target="_blank" rel="noreferrer"
                                className="p-1.5 rounded-lg text-white/30 hover:text-[#c8a96e] hover:bg-[#c8a96e]/8 transition-all" title={t('admin.viewCV')}>
                                <FileText size={14} />
                              </a>
                            )}
                            {/* Accept */}
                            {app.status !== 'interview_scheduled' && app.status !== 'rejected' && (
                              <button onClick={() => openDialog(app)}
                                className="p-1.5 rounded-lg text-green-400/60 hover:text-green-400 hover:bg-green-500/8 transition-all" title={t('admin.scheduleInterview')}>
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {/* Reject */}
                            {app.status !== 'rejected' && (
                              <button onClick={() => rejectApp(app.id)}
                                className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all" title={t('admin.reject')}>
                                {actionId === app.id + 'reject' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                              </button>
                            )}
                            {/* Delete */}
                            <button onClick={() => deleteApp(app.id)}
                              className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/8 transition-all" title={t('admin.delete')}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          VIEW DIALOG — applicant full details
      ══════════════════════════════════════════ */}
      {viewApp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#0d0d14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#c8a96e]/12 border border-[#c8a96e]/25 flex items-center justify-center">
                  <span className="text-[#c8a96e] font-black text-sm">{viewApp.fullName?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">{viewApp.fullName}</h2>
                  <p className="text-white/40 text-xs">{viewApp.position}</p>
                </div>
              </div>
              <button onClick={closeViewDialog} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Info grid */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Mail size={12} />,     label: 'البريد الإلكتروني', value: viewApp.email },
                  { icon: <Phone size={12} />,    label: 'رقم الهاتف',       value: viewApp.phone },
                  { icon: <MapPin size={12} />,   label: 'المدينة',          value: viewApp.city || '—' },
                  { icon: <Clock size={12} />,    label: 'سنوات الخبرة',    value: viewApp.experience || '—' },
                  { icon: <Briefcase size={12} />,label: 'الوظيفة',          value: viewApp.position },
                  { icon: <Calendar size={12} />, label: 'تاريخ التقديم',   value: viewApp.createdAt?.seconds ? new Date(viewApp.createdAt.seconds * 1000).toLocaleDateString('ar-SA') : '—' },
                ].map(row => (
                  <div key={row.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#c8a96e] mb-1.5">
                      {row.icon}
                      <span className="text-[10px] font-bold text-white/35">{row.label}</span>
                    </div>
                    <p className="text-white text-xs font-semibold leading-relaxed">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Smart score */}
              {(() => {
                const sc = scoreApp(viewApp);
                return (
                  <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={13} className="text-purple-400" />
                      <span className="text-purple-300 text-xs font-bold">تقييم الذكاء الاصطناعي</span>
                      {sc.isBestMatch && <span className="text-[10px] font-black text-purple-300 bg-purple-500/20 rounded-full px-2 py-0.5">⭐ أفضل مرشح</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-purple-300 font-black text-lg">{sc.expScore}</p>
                        <p className="text-white/30 text-[10px]">درجة الخبرة</p>
                      </div>
                      <div>
                        <p className="text-purple-300 font-black text-lg">{sc.cityScore}</p>
                        <p className="text-white/30 text-[10px]">درجة المدينة</p>
                      </div>
                      <div>
                        <p className="text-[#c8a96e] font-black text-lg">{sc.total}</p>
                        <p className="text-white/30 text-[10px]">الإجمالي</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cover letter */}
              {viewApp.coverLetter && (
                <div className="space-y-2">
                  <p className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest">رسالة التقديم</p>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-white/65 text-xs leading-relaxed whitespace-pre-wrap">{viewApp.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* CV button */}
              {viewApp.cvUrl && (
                <a href={viewApp.cvUrl} target="_blank" rel="noreferrer" download
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] text-sm font-bold hover:bg-[#c8a96e]/18 transition-all">
                  <Download size={15} />
                  تحميل السيرة الذاتية
                </a>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3">
              <button onClick={closeViewDialog}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:text-white hover:border-white/20 transition-all">
                إغلاق
              </button>
              {viewApp.status !== 'interview_scheduled' && viewApp.status !== 'rejected' && (
                <button onClick={() => { closeViewDialog(); openDialog(viewApp); }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#c8a96e] to-[#B8923A] text-black text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <CheckCircle size={15} />
                  جدولة مقابلة
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ACCEPT / INTERVIEW DIALOG
      ══════════════════════════════════════════ */}
      {dialogApp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#0d0d14]">
              <div>
                <h2 className="text-white font-bold text-base">{t('admin.scheduleInterview')}</h2>
                <p className="text-white/40 text-xs mt-0.5">{dialogApp.fullName} — {dialogApp.position}</p>
              </div>
              <button onClick={closeDialog} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2 text-xs text-white/45"><Mail size={12} className="text-[#c8a96e]" />{dialogApp.email}</div>
              <div className="flex items-center gap-2 text-xs text-white/45"><Phone size={12} className="text-[#c8a96e]" />{dialogApp.phone}</div>
              <div className="flex items-center gap-2 text-xs text-white/45"><Briefcase size={12} className="text-[#c8a96e]" />{dialogApp.position}</div>
              <div className="flex items-center gap-2 text-xs text-white/45"><Clock size={12} className="text-[#c8a96e]" />{dialogApp.experience || '—'}</div>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
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
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.interviewLocation')}</label>
                <input type="text" value={interviewLocation} onChange={e => setInterviewLocation(e.target.value)}
                  placeholder={interviewType === 'in_person' ? 'مقر الشركة — جدة' : interviewType === 'video' ? 'رابط Google Meet / Zoom' : 'رقم للتواصل'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#c8a96e] text-[10px] font-black uppercase tracking-widest block">{t('admin.additionalMessage')}</label>
                <textarea rows={3} value={additionalMessage} onChange={e => setAdditionalMessage(e.target.value)}
                  placeholder="أي تعليمات إضافية للمتقدم..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#c8a96e]/50 outline-none transition-all resize-none" />
              </div>
              {sendStatus === 'success' && <p className="text-green-400 text-sm font-semibold text-center">{t('admin.emailSentSuccess')}</p>}
              {sendStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm font-semibold text-center mb-1">{t('admin.emailSentError')}</p>
                  {sendError && <p className="text-red-300/70 text-xs text-center break-all">{sendError}</p>}
                </div>
              )}
            </div>

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
