'use client';
import { useState, useRef } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ACTIVITY_TYPES, FILE_FIELDS } from '@/lib/suppliersConfig';
import {
  CheckCircle2, Upload, X, Loader2, Building2,
  User, Phone, Mail, MapPin, FileText, Image as ImageIcon
} from 'lucide-react';

const CITIES = [
  'الرياض','جدة','مكة المكرمة','المدينة المنورة','الدمام','الخبر','الظهران',
  'الأحساء','القطيف','تبوك','بريدة','أبها','خميس مشيط','القصيم','حائل',
  'نجران','جازان','ينبع','الطائف','أخرى'
];

const FIELD_ICONS = {
  commercialRegisterFile: FileText,
  taxCertificateFile:     FileText,
  catalogFile:            FileText,
  priceListFile:          FileText,
  images:                 ImageIcon,
};

export default function SuppliersPage() {
  const [form, setForm] = useState({
    companyName: '', contactPerson: '', phone: '', email: '',
    city: '', activityTypes: [], description: '',
  });
  const [files, setFiles]         = useState({});
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const fileInputRefs               = useRef({});

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const toggleActivity = (type) => {
    setForm(f => ({
      ...f,
      activityTypes: f.activityTypes.includes(type)
        ? f.activityTypes.filter(t => t !== type)
        : [...f.activityTypes, type],
    }));
    setErrors(e => ({ ...e, activityTypes: '' }));
  };

  const handleFile = (key, selectedFiles) => {
    const isMulti = FILE_FIELDS.find(f => f.key === key)?.multiple;
    setFiles(prev => ({
      ...prev,
      [key]: isMulti ? Array.from(selectedFiles) : selectedFiles[0],
    }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const removeFile = (key, idx) => {
    setFiles(prev => {
      const cur = prev[key];
      if (Array.isArray(cur)) {
        const next = cur.filter((_, i) => i !== idx);
        return { ...prev, [key]: next.length ? next : undefined };
      }
      return { ...prev, [key]: undefined };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim())       e.companyName   = 'مطلوب';
    if (!form.contactPerson.trim())     e.contactPerson = 'مطلوب';
    if (!form.phone.trim())             e.phone         = 'مطلوب';
    if (!form.city)                     e.city          = 'مطلوب';
    if (!form.activityTypes.length)     e.activityTypes = 'اختر نوع نشاط واحد على الأقل';
    if (!files.commercialRegisterFile)  e.commercialRegisterFile = 'مطلوب';
    if (!files.taxCertificateFile)      e.taxCertificateFile     = 'مطلوب';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'suppliers'), {
        ...form, status: 'new', createdAt: serverTimestamp(),
        adminNotes: '', reviewedAt: null,
      });
      const id = docRef.id;
      const uploadedFiles = {};

      for (const field of FILE_FIELDS) {
        const f = files[field.key];
        if (!f) continue;
        if (Array.isArray(f)) {
          uploadedFiles[field.key] = await Promise.all(
            f.map((file, i) => uploadFile(file, `suppliers/${id}/${field.key}_${i}_${file.name}`))
          );
        } else {
          uploadedFiles[field.key] = await uploadFile(f, `suppliers/${id}/${field.key}_${f.name}`);
        }
      }

      await updateDoc(doc(db, 'suppliers', id), uploadedFiles);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مجددًا.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            تم استلام طلبك بنجاح!
          </h2>
          <p className="text-sm opacity-60 mb-8" style={{ color: 'var(--text)' }}>
            شكرًا لتسجيل شركتك لدى MNC. سيقوم فريقنا بمراجعة بياناتك والتواصل معك خلال 3–5 أيام عمل.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ companyName:'',contactPerson:'',phone:'',email:'',city:'',activityTypes:[],description:'' }); setFiles({}); }}
            className="bg-[#c8a96e] text-black font-semibold px-8 py-3 rounded-xl hover:bg-[#b8995e] transition-colors"
          >
            تسجيل مورد آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#c8a96e]/10 border border-[#c8a96e]/20 mb-4">
            <Building2 size={24} className="text-[#c8a96e]" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            تسجيل مورد جديد
          </h1>
          <p className="text-sm opacity-50" style={{ color: 'var(--text)' }}>
            أكمل النموذج أدناه للانضمام إلى شبكة موردي MNC للإنشاءات
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Section title="المعلومات الأساسية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="اسم الشركة *" error={errors.companyName} icon={Building2}>
                <input
                  value={form.companyName}
                  onChange={e => set('companyName', e.target.value)}
                  placeholder="شركة المقاولات المتحدة"
                  className={inputCls(errors.companyName)}
                />
              </Field>
              <Field label="اسم المسؤول *" error={errors.contactPerson} icon={User}>
                <input
                  value={form.contactPerson}
                  onChange={e => set('contactPerson', e.target.value)}
                  placeholder="أحمد محمد"
                  className={inputCls(errors.contactPerson)}
                />
              </Field>
              <Field label="رقم الجوال *" error={errors.phone} icon={Phone}>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className={inputCls(errors.phone)}
                />
              </Field>
              <Field label="البريد الإلكتروني" error={errors.email} icon={Mail}>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="info@company.com"
                  dir="ltr"
                  className={inputCls(errors.email)}
                />
              </Field>
              <Field label="المدينة *" error={errors.city} icon={MapPin}>
                <select
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  className={inputCls(errors.city)}
                >
                  <option value="">اختر المدينة</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </Section>

          {/* Activity Types */}
          <Section title="نوع النشاط *" error={errors.activityTypes}>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map(type => {
                const active = form.activityTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleActivity(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all
                      ${active
                        ? 'bg-[#c8a96e] border-[#c8a96e] text-black font-semibold'
                        : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                      }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Description */}
          <Section title="وصف النشاط">
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
              placeholder="اكتب وصفًا مختصرًا عن نشاط شركتك، منتجاتك وخبرتك..."
              className={`${inputCls()} w-full resize-none`}
            />
          </Section>

          {/* Files */}
          <Section title="المستندات والملفات">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FILE_FIELDS.map(field => {
                const Icon = FIELD_ICONS[field.key] ?? FileText;
                const val  = files[field.key];
                const err  = errors[field.key];
                const required = ['commercialRegisterFile','taxCertificateFile'].includes(field.key);
                return (
                  <div key={field.key}>
                    <label className="block text-xs mb-1.5" style={{ color: 'var(--text)', opacity: 0.5 }}>
                      {field.label}{required ? ' *' : ''}
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors
                        ${err ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-[#c8a96e]/40 bg-white/[0.02]'}`}
                      onClick={() => fileInputRefs.current[field.key]?.click()}
                    >
                      <input
                        ref={el => fileInputRefs.current[field.key] = el}
                        type="file"
                        accept={field.accept}
                        multiple={field.multiple}
                        className="hidden"
                        onChange={e => handleFile(field.key, e.target.files)}
                      />
                      {!val ? (
                        <div className="flex flex-col items-center gap-1 py-2">
                          <Upload size={20} className="text-white/20" />
                          <span className="text-xs text-white/30">{field.accept}</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {(Array.isArray(val) ? val : [val]).map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-[#c8a96e]/10 rounded-lg px-2 py-1">
                              <Icon size={12} className="text-[#c8a96e] shrink-0" />
                              <span className="truncate text-white/70 flex-1 text-right">{f.name}</span>
                              <button
                                type="button"
                                onClick={e => { e.stopPropagation(); removeFile(field.key, i); }}
                                className="text-white/30 hover:text-red-400 shrink-0"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {err && <p className="text-red-400 text-xs mt-1 text-right">{err}</p>}
                  </div>
                );
              })}
            </div>
          </Section>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#c8a96e] hover:bg-[#b8995e] disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-3 text-base"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : null}
            {submitting ? 'جاري إرسال الطلب...' : 'إرسال طلب التسجيل'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children, error }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-[#c8a96e] mb-5">{title}</h3>
      {error && <p className="text-red-400 text-xs mb-3 -mt-2">{error}</p>}
      {children}
    </div>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs mb-1.5 text-white/50">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />}
        <div className={Icon ? '[&>*]:pr-9' : ''}>
          {children}
        </div>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full bg-white/5 border rounded-xl py-2.5 px-3 text-white text-sm placeholder:text-white/20 focus:outline-none transition-colors
    ${error ? 'border-red-500/40 focus:border-red-500/60' : 'border-white/10 focus:border-[#c8a96e]/40'}`;
}
