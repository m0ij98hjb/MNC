'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase, Eye, EyeOff } from 'lucide-react';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContent';
import { Field, TextArea, SaveBtn, Grid2, TabLoading } from './Shared';

const EMPTY_JOB = () => ({
  id: crypto.randomUUID(),
  title_ar: '', title_en: '',
  desc_ar: '', desc_en: '',
  type: 'full',
  location: 'جدة',
  visible: true,
});

const TYPE_LABELS = { full: 'دوام كامل', part: 'دوام جزئي', training: 'تدريب' };

export default function JobsTab() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState(null);
  const [draft, setDraft]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    loadSiteContent('jobs').then(d => {
      setJobs(d.listings || []);
      setLoading(false);
    });
  }, []);

  const openNew  = () => { setDraft(EMPTY_JOB()); setEditId('__new__'); };
  const openEdit = (j) => { setDraft({ ...j }); setEditId(j.id); };
  const close    = () => { setDraft(null); setEditId(null); };

  const setF = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const applyDraft = () => {
    if (editId === '__new__') setJobs(p => [...p, draft]);
    else setJobs(p => p.map(j => j.id === editId ? draft : j));
    close();
  };

  const remove  = (id) => { if (confirm('حذف الوظيفة؟')) setJobs(p => p.filter(j => j.id !== id)); };
  const toggle  = (id) => setJobs(p => p.map(j => j.id === id ? { ...j, visible: !j.visible } : j));

  const save = async () => {
    setSaving(true);
    try { await saveSiteContent('jobs', { listings: jobs }); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">{jobs.length} وظيفة · {jobs.filter(j => j.visible).length} مرئية</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(201,163,77,0.10)', border: '1px solid rgba(201,163,77,0.30)', color: '#c8a96e' }}>
          <Plus size={13} /> وظيفة جديدة
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Briefcase size={28} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/20 text-sm">لا توجد وظائف بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!job.visible ? 'opacity-40' : ''}`}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Briefcase size={13} className="text-[#c8a96e]/50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{job.title_ar || job.title_en || '—'}</p>
                <p className="text-xs text-white/30">{TYPE_LABELS[job.type] || job.type} · {job.location}</p>
              </div>
              <button onClick={() => toggle(job.id)} className={`p-1.5 rounded-lg transition-all ${job.visible ? 'text-green-400/60 hover:text-green-400' : 'text-white/20 hover:text-white/50'}`}>
                {job.visible ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                <Pencil size={13} />
              </button>
              <button onClick={() => remove(job.id)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/8 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <SaveBtn saving={saving} saved={saved} onClick={save} />

      {draft && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={close}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            style={{ background: '#0a0e17', border: '1px solid rgba(201,163,77,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{editId === '__new__' ? 'وظيفة جديدة' : 'تعديل الوظيفة'}</h3>
              <button onClick={close} className="text-white/30 hover:text-white"><X size={15} /></button>
            </div>
            <Grid2>
              <Field label="المسمى (عربي)" value={draft.title_ar} onChange={v => setF('title_ar', v)} />
              <Field label="Title (EN)" value={draft.title_en} onChange={v => setF('title_en', v)} />
            </Grid2>
            <Grid2>
              <TextArea label="الوصف (عربي)" value={draft.desc_ar} onChange={v => setF('desc_ar', v)} rows={3} />
              <TextArea label="Description (EN)" value={draft.desc_en} onChange={v => setF('desc_en', v)} rows={3} />
            </Grid2>
            <Grid2>
              <div className="space-y-1.5">
                <label className="block text-[11px] text-white/38 font-semibold uppercase tracking-wider">نوع الوظيفة</label>
                <select value={draft.type} onChange={e => setF('type', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none">
                  <option value="full">دوام كامل</option>
                  <option value="part">دوام جزئي</option>
                  <option value="training">تدريب</option>
                </select>
              </div>
              <Field label="الموقع" value={draft.location} onChange={v => setF('location', v)} placeholder="جدة" />
            </Grid2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.visible} onChange={e => setF('visible', e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-sm text-white/60">مرئية للزوار</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={applyDraft}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(201,163,77,0.12)', border: '1px solid rgba(201,163,77,0.35)', color: '#c8a96e' }}>
                تأكيد
              </button>
              <button onClick={close} className="px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
