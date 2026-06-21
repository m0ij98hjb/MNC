'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, GripVertical, FolderOpen } from 'lucide-react';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContent';
import { Field, TextArea, SaveBtn, ImageUpload, Grid2, TabLoading } from './Shared';

const EMPTY = () => ({
  id: crypto.randomUUID(),
  name_ar: '', name_en: '',
  desc_ar: '', desc_en: '',
  image: '',
  category: '',
  city: '',
  order: 0,
});

export default function ProjectsTab() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState(null);
  const [draft, setDraft]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    loadSiteContent('projects').then(d => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, []);

  const openNew  = () => { setDraft(EMPTY()); setEditId('__new__'); };
  const openEdit = (item) => { setDraft({ ...item }); setEditId(item.id); };
  const closeDlg = () => { setDraft(null); setEditId(null); };

  const setF = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const applyDraft = () => {
    if (editId === '__new__') {
      setItems(p => [...p, { ...draft, order: p.length }]);
    } else {
      setItems(p => p.map(x => x.id === editId ? draft : x));
    }
    closeDlg();
  };

  const remove = (id) => {
    if (confirm('حذف المشروع؟')) setItems(p => p.filter(x => x.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteContent('projects', { items });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  if (loading) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">{items.length} مشروع</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(201,163,77,0.10)', border: '1px solid rgba(201,163,77,0.30)', color: '#c8a96e' }}
        >
          <Plus size={13} /> مشروع جديد
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
          <FolderOpen size={28} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/20 text-sm">لا توجد مشاريع بعد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <GripVertical size={14} className="text-white/15 flex-shrink-0" />
              {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.name_ar || item.name_en || '—'}</p>
                <p className="text-xs text-white/30 truncate">{item.city} {item.category && `· ${item.category}`}</p>
              </div>
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                <Pencil size={13} />
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/8 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <SaveBtn saving={saving} saved={saved} onClick={save} />

      {/* Edit dialog */}
      {draft && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={closeDlg}>
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            style={{ background: '#0a0e17', border: '1px solid rgba(201,163,77,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{editId === '__new__' ? 'مشروع جديد' : 'تعديل المشروع'}</h3>
              <button onClick={closeDlg} className="text-white/30 hover:text-white"><X size={15} /></button>
            </div>
            <ImageUpload label="صورة المشروع" value={draft.image} onChange={v => setF('image', v)} />
            <Grid2>
              <Field label="الاسم (عربي)" value={draft.name_ar} onChange={v => setF('name_ar', v)} />
              <Field label="الاسم (إنجليزي)" value={draft.name_en} onChange={v => setF('name_en', v)} />
            </Grid2>
            <Grid2>
              <TextArea label="الوصف (عربي)" value={draft.desc_ar} onChange={v => setF('desc_ar', v)} rows={2} />
              <TextArea label="الوصف (إنجليزي)" value={draft.desc_en} onChange={v => setF('desc_en', v)} rows={2} />
            </Grid2>
            <Grid2>
              <Field label="التصنيف" value={draft.category} onChange={v => setF('category', v)} placeholder="سكني / تجاري..." />
              <Field label="المدينة" value={draft.city} onChange={v => setF('city', v)} placeholder="جدة" />
              <Field label="الترتيب" value={draft.order} onChange={v => setF('order', Number(v))} type="number" />
            </Grid2>
            <div className="flex gap-3 pt-2">
              <button onClick={applyDraft}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'rgba(201,163,77,0.12)', border: '1px solid rgba(201,163,77,0.35)', color: '#c8a96e' }}>
                تأكيد
              </button>
              <button onClick={closeDlg}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
