'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Briefcase, Eye, EyeOff } from 'lucide-react';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContent';
import { Field, TextArea, SaveBtn, Grid2, TabLoading } from './Shared';
import { useLanguage } from '@/context/LanguageContext';
import { useConfirm } from '@/context/ConfirmContext';

const EMPTY_JOB = () => ({
  id: crypto.randomUUID(),
  title_ar: '', title_en: '',
  dept_ar: '', dept_en: '',
  desc_ar: '', desc_en: '',
  type: 'full',
  location: 'جدة',
  visible: true,
  isPublished: false,
});

// Legacy listings only have `visible` — mirror it into `isPublished` on
// first read so previously-visible jobs don't vanish from the public site.
const withPublishedFlag = (job) => ({
  ...job,
  isPublished: job.isPublished !== undefined ? job.isPublished : job.visible !== false,
});

// The 16 positions that used to be hard-coded on the public /careers page
// (src/locales/*.js → careers.positions), before that page started reading
// from this Firestore-backed list. One-time import so an admin can see them
// here and choose which ones to publish, instead of re-typing all of them.
const LEGACY_POSITIONS = [
  { title_ar: "مدير مشروع", title_en: "Project Manager", dept_ar: "إدارة المشاريع", dept_en: "Project Management", desc_ar: "قيادة وإدارة المشاريع الإنشائية من الصفر حتى التسليم بأعلى المعايير.", desc_en: "Lead and manage construction projects from inception to delivery at the highest standards." },
  { title_ar: "مهندس مدني", title_en: "Civil Engineer", dept_ar: "الهندسة المدنية", dept_en: "Civil Engineering", desc_ar: "تصميم ومراجعة المخططات الإنشائية والإشراف على تنفيذها ميدانياً.", desc_en: "Design and review structural plans and supervise their field execution." },
  { title_ar: "مصمم معماري", title_en: "Architectural Designer", dept_ar: "التصميم المعماري", dept_en: "Architecture", desc_ar: "ابتكار حلول معمارية إبداعية وتحويل رؤية العميل إلى تصاميم واقعية.", desc_en: "Create innovative architectural solutions and turn client visions into realistic designs." },
  { title_ar: "مصمم داخلي", title_en: "Interior Designer", dept_ar: "التصميم الداخلي", dept_en: "Interior Design", desc_ar: "تصميم الفراغات الداخلية بأسلوب عصري يجمع بين الجمالية والوظيفية.", desc_en: "Design interior spaces in a contemporary style combining aesthetics and functionality." },
  { title_ar: "مشرف موقع", title_en: "Site Supervisor", dept_ar: "التنفيذ الميداني", dept_en: "Field Execution", desc_ar: "متابعة ومراقبة تنفيذ أعمال البناء والتأكد من مطابقتها للمخططات.", desc_en: "Follow up and monitor construction work execution ensuring conformity with drawings." },
  { title_ar: "مراقب كميات", title_en: "Quantity Surveyor", dept_ar: "الكميات والتكاليف", dept_en: "Quantities & Costs", desc_ar: "إعداد جداول الكميات وحساب التكاليف والإشراف على المواد والموارد.", desc_en: "Prepare quantity schedules, calculate costs and oversee materials and resources." },
  { title_ar: "مصمم AutoCAD", title_en: "AutoCAD Designer", dept_ar: "الرسم الهندسي", dept_en: "Engineering Drafting", desc_ar: "رسم وتعديل المخططات الهندسية باحترافية عالية باستخدام أحدث البرامج.", desc_en: "Draw and modify engineering plans professionally using the latest software." },
  { title_ar: "مدير مبيعات", title_en: "Sales Manager", dept_ar: "المبيعات والأعمال", dept_en: "Sales & Business", desc_ar: "تطوير الأعمال وإدارة علاقات العملاء وتحقيق أهداف النمو للشركة.", desc_en: "Develop business, manage client relationships, and achieve organizational growth targets." },
  { title_ar: "مهندس ميكانيكا", title_en: "Mechanical Engineer", dept_ar: "الهندسة الميكانيكية", dept_en: "Mechanical Engineering", desc_ar: "تصميم ومراجعة أنظمة التكييف والتبريد والصرف الصحي والإشراف على تنفيذها ميدانياً.", desc_en: "Design and review HVAC, plumbing, and drainage systems and supervise their field execution." },
  { title_ar: "مهندس كهرباء", title_en: "Electrical Engineer", dept_ar: "الهندسة الكهربائية", dept_en: "Electrical Engineering", desc_ar: "تصميم وتنفيذ الأنظمة الكهربائية وأنظمة الإنارة والطاقة في المشاريع الإنشائية.", desc_en: "Design and implement electrical systems, lighting, and power solutions in construction projects." },
  { title_ar: "مهندس أمن وسلامة", title_en: "Safety Engineer", dept_ar: "الصحة والسلامة المهنية", dept_en: "Health & Safety", desc_ar: "تطبيق معايير السلامة المهنية وإعداد خطط الطوارئ وضمان بيئة عمل آمنة في المواقع الإنشائية.", desc_en: "Apply occupational safety standards, prepare emergency plans, and ensure a safe work environment on construction sites." },
  { title_ar: "مهندس ديكور", title_en: "Interior Decorator", dept_ar: "الديكور والتشطيبات", dept_en: "Decor & Finishing", desc_ar: "تصميم وتنفيذ أعمال الديكور والتشطيبات الداخلية بأعلى مستويات الجودة والإبداع.", desc_en: "Design and execute interior decoration and finishing works to the highest standards of quality and creativity." },
  { title_ar: "سكرتير إداري", title_en: "Administrative Secretary", dept_ar: "الإدارة", dept_en: "Administration", desc_ar: "تنظيم المواعيد والمراسلات وإدارة الملفات والمهام الإدارية اليومية لدعم الفريق التنفيذي.", desc_en: "Organize appointments, manage correspondence, files, and daily administrative tasks to support the executive team." },
  { title_ar: "داكيومنت كنترول", title_en: "Document Controller", dept_ar: "إدارة الوثائق", dept_en: "Document Management", desc_ar: "إدارة ومراقبة وثائق المشاريع الهندسية والتنظيمية وضمان سهولة الوصول إليها وتحديثها.", desc_en: "Manage, control, and archive engineering and organizational project documents, ensuring easy access and regular updates." },
  { title_ar: "أخصائي عقود", title_en: "Contract Specialist", dept_ar: "العقود والمشتريات", dept_en: "Contracts & Procurement", desc_ar: "صياغة ومراجعة العقود التجارية والإنشائية وضمان الامتثال للمتطلبات القانونية والتنظيمية.", desc_en: "Draft and review commercial and construction contracts, ensuring compliance with legal and regulatory requirements." },
  { title_ar: "مهندس تقنية معلومات", title_en: "IT Engineer", dept_ar: "تقنية المعلومات (IT)", dept_en: "Information Technology (IT)", desc_ar: "إدارة البنية التحتية لتقنية المعلومات بالشركة، صيانة المواقع والمنصات الرقمية، مراقبة أمن الشبكات، وتقديم الدعم الفني.", desc_en: "Manage company IT infrastructure, maintain company website and digital platforms, monitor network security, and provide technical support." },
];

const TYPE_LABEL_KEYS = {
  full: 'admin.contentTabs.jobsTab.typeFullTime',
  part: 'admin.contentTabs.jobsTab.typePartTime',
  training: 'admin.contentTabs.jobsTab.typeTraining',
  supervision: 'admin.contentTabs.jobsTab.typeSupervision',
  skilled: 'admin.contentTabs.jobsTab.typeSkilled',
};

export default function JobsTab() {
  const { t } = useLanguage();
  const { confirm, alert } = useConfirm();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState(null);
  const [draft, setDraft]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    loadSiteContent('jobs').then(d => {
      setJobs((d.listings || []).map(withPublishedFlag));
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

  const remove  = async (id) => { if (await confirm(t('admin.contentTabs.jobsTab.deleteJobConfirm'), { variant: 'danger' })) setJobs(p => p.filter(j => j.id !== id)); };
  const toggle  = (id) => setJobs(p => p.map(j => j.id === id ? { ...j, isPublished: !j.isPublished } : j));

  const importLegacyPositions = () => {
    setJobs(p => [
      ...p,
      ...LEGACY_POSITIONS.map(lp => ({
        id: crypto.randomUUID(), ...lp,
        type: 'full', location: 'جدة', visible: true, isPublished: false,
      })),
    ]);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteContent('jobs', { listings: jobs });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      await alert(t('admin.contentTabs.jobsTab.saveFailed') + err.message, { variant: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">{jobs.length} {t('admin.contentTabs.jobsTab.jobsCountLabel')} · {jobs.filter(j => j.isPublished).length} {t('admin.contentTabs.jobsTab.visibleCountLabel')}</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(201,163,77,0.10)', border: '1px solid rgba(201,163,77,0.30)', color: '#c8a96e' }}>
          <Plus size={13} /> {t('admin.contentTabs.jobsTab.newJobBtn')}
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Briefcase size={28} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/20 text-sm mb-4">{t('admin.contentTabs.jobsTab.noJobsYetLabel')}</p>
          <button onClick={importLegacyPositions}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(201,163,77,0.10)', border: '1px solid rgba(201,163,77,0.30)', color: '#c8a96e' }}>
            {t('admin.contentTabs.jobsTab.importPositionsBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.id}
              onClick={() => openEdit(job)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer hover:bg-white/[0.04] ${!job.isPublished ? 'opacity-40' : ''}`}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Briefcase size={13} className="text-[#c8a96e]/50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{job.title_ar || job.title_en || '—'}</p>
                <p className="text-xs text-white/30">{job.type in TYPE_LABEL_KEYS ? t(TYPE_LABEL_KEYS[job.type]) : job.type} · {job.location}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); toggle(job.id); }} className={`p-1.5 rounded-lg transition-all ${job.isPublished ? 'text-green-400/60 hover:text-green-400' : 'text-white/20 hover:text-white/50'}`}>
                {job.isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button onClick={e => { e.stopPropagation(); openEdit(job); }} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                <Pencil size={13} />
              </button>
              <button onClick={e => { e.stopPropagation(); remove(job.id); }} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/8 transition-all">
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
              <h3 className="text-sm font-bold text-white">{editId === '__new__' ? t('admin.contentTabs.jobsTab.newJobModalTitle') : t('admin.contentTabs.jobsTab.editJobModalTitle')}</h3>
              <button onClick={close} className="text-white/30 hover:text-white"><X size={15} /></button>
            </div>
            <Grid2>
              <Field label={t('admin.contentTabs.jobsTab.titleArLabel')} value={draft.title_ar} onChange={v => setF('title_ar', v)} />
              <Field label={t('admin.contentTabs.jobsTab.titleEnLabel')} value={draft.title_en} onChange={v => setF('title_en', v)} />
            </Grid2>
            <Grid2>
              <Field label={t('admin.contentTabs.jobsTab.deptArLabel')} value={draft.dept_ar} onChange={v => setF('dept_ar', v)} />
              <Field label={t('admin.contentTabs.jobsTab.deptEnLabel')} value={draft.dept_en} onChange={v => setF('dept_en', v)} />
            </Grid2>
            <Grid2>
              <TextArea label={t('admin.contentTabs.jobsTab.descArLabel')} value={draft.desc_ar} onChange={v => setF('desc_ar', v)} rows={3} />
              <TextArea label={t('admin.contentTabs.jobsTab.descEnLabel')} value={draft.desc_en} onChange={v => setF('desc_en', v)} rows={3} />
            </Grid2>
            <Grid2>
              <div className="space-y-1.5">
                <label className="block text-[11px] text-white/38 font-semibold uppercase tracking-wider">{t('admin.contentTabs.jobsTab.jobTypeLabel')}</label>
                <select value={draft.type} onChange={e => setF('type', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none">
                  <option value="full">{t(TYPE_LABEL_KEYS.full)}</option>
                  <option value="part">{t(TYPE_LABEL_KEYS.part)}</option>
                  <option value="training">{t(TYPE_LABEL_KEYS.training)}</option>
                  <option value="supervision">{t(TYPE_LABEL_KEYS.supervision)}</option>
                  <option value="skilled">{t(TYPE_LABEL_KEYS.skilled)}</option>
                </select>
              </div>
              <Field label={t('admin.contentTabs.jobsTab.locationLabel')} value={draft.location} onChange={v => setF('location', v)} placeholder={t('admin.contentTabs.jobsTab.locationPlaceholder')} />
            </Grid2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.isPublished} onChange={e => setF('isPublished', e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-sm text-white/60">{t('admin.contentTabs.jobsTab.visibleToVisitorsLabel')}</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={applyDraft}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: 'rgba(201,163,77,0.12)', border: '1px solid rgba(201,163,77,0.35)', color: '#c8a96e' }}>
                {t('admin.contentTabs.jobsTab.confirmBtn')}
              </button>
              <button onClick={close} className="px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors">
                {t('admin.contentTabs.jobsTab.cancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
