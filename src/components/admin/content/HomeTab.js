'use client';
import { useState, useEffect } from 'react';
import { Image as ImgIcon, BarChart2, FileText } from 'lucide-react';
import { loadSiteContent, saveSiteContent } from '@/lib/siteContent';
import { Field, TextArea, Section, SaveBtn, ImageUpload, Grid2, TabLoading } from './Shared';

const DEF = {
  hero_title_ar: 'نبني المستقبل بجودة استثنائية',
  hero_title_en: 'We Build the Future with Exceptional Quality',
  hero_sub_ar: 'خبرة تمتد منذ عام 1986 في المقاولات والتصميم المعماري',
  hero_sub_en: 'Expertise since 1986 in contracting and architectural design',
  hero_image: '',
  stat_projects: 230,
  stat_satisfaction: 99,
  stat_designs: 104,
  cta_ar: 'ابدأ مشروعك معنا اليوم',
  cta_en: 'Start Your Project with Us Today',
};

export default function HomeTab() {
  const [form, setForm]     = useState(DEF);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]  = useState(false);
  const [saved, setSaved]    = useState(false);

  useEffect(() => {
    loadSiteContent('home').then(d => {
      if (Object.keys(d).length) setForm(p => ({ ...p, ...d }));
      setLoading(false);
    });
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await saveSiteContent('home', form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    finally { setSaving(false); }
  };

  if (loading) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-2xl">
      <Section title="قسم الهيرو" icon={ImgIcon}>
        <ImageUpload label="صورة الهيرو" value={form.hero_image} onChange={v => set('hero_image', v)} />
        <Grid2>
          <Field label="العنوان (عربي)" value={form.hero_title_ar} onChange={v => set('hero_title_ar', v)} />
          <Field label="العنوان (إنجليزي)" value={form.hero_title_en} onChange={v => set('hero_title_en', v)} />
        </Grid2>
        <Grid2>
          <TextArea label="النص التعريفي (عربي)" value={form.hero_sub_ar} onChange={v => set('hero_sub_ar', v)} rows={2} />
          <TextArea label="النص التعريفي (إنجليزي)" value={form.hero_sub_en} onChange={v => set('hero_sub_en', v)} rows={2} />
        </Grid2>
      </Section>

      <Section title="الإحصائيات" icon={BarChart2}>
        <Grid2>
          <Field label="عدد المشاريع" value={form.stat_projects} onChange={v => set('stat_projects', Number(v))} type="number" />
          <Field label="نسبة رضى العملاء (%)" value={form.stat_satisfaction} onChange={v => set('stat_satisfaction', Number(v))} type="number" />
          <Field label="عدد التصاميم" value={form.stat_designs} onChange={v => set('stat_designs', Number(v))} type="number" />
        </Grid2>
      </Section>

      <Section title="نص الدعوة للتصرف (CTA)" icon={FileText}>
        <Grid2>
          <Field label="النص (عربي)" value={form.cta_ar} onChange={v => set('cta_ar', v)} />
          <Field label="النص (إنجليزي)" value={form.cta_en} onChange={v => set('cta_en', v)} />
        </Grid2>
      </Section>

      <SaveBtn saving={saving} saved={saved} onClick={save} />
    </div>
  );
}
