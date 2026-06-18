'use client';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ACTIVITY_TYPES } from '@/lib/suppliersConfig';
import Navbar from '@/components/layout/Navbar';
import {
  Building2, User, Phone, Mail, MapPin, Globe, ChevronDown,
  Send, CheckCircle2, Loader2, Briefcase, FileText, Truck,
  Clock, MessageSquare, Tag
} from 'lucide-react';

const COUNTRIES = [
  'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Bahrain',
  'Oman', 'Egypt', 'Jordan', 'Lebanon', 'Iraq', 'Other',
];

export default function SuppliersPage() {
  const [form, setForm] = useState({
    companyName: '', contactName: '', phone: '', email: '',
    city: '', country: '', website: '',
    activity: '',
    description: '', brands: '', coverageArea: '', deliveryTime: '', notes: '',
  });
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Required';
    if (!form.contactName.trim()) e.contactName = 'Required';
    if (!form.phone.trim())       e.phone       = 'Required';
    if (!form.email.trim())       e.email       = 'Required';
    if (!form.city.trim())        e.city        = 'Required';
    if (!form.country)            e.country     = 'Required';
    if (!form.activity)           e.activity    = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...form,
        status:    'new',
        createdAt: serverTimestamp(),
        adminNotes: '',
        reviewedAt: null,
      });
      setSubmitted(true);
    } catch {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      companyName:'', contactName:'', phone:'', email:'',
      city:'', country:'', website:'',
      activity:'',
      description:'', brands:'', coverageArea:'', deliveryTime:'', notes:'',
    });
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white font-cairo">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#0f172a]" />
        {/* Gold diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D5B25D 0px, #D5B25D 1px, transparent 1px, transparent 80px)' }}
        />
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-secondary/30 rounded-full px-5 py-2 mb-6" data-aos="fade-up">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-xs font-bold tracking-widest uppercase">
              Supplier Registration
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
            Supplier <span className="text-gradient">Portal</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Submit your company information and service offerings for review by MNC Construction.
            Join our trusted network of suppliers and partners.
          </p>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="py-16 sm:py-24 bg-[var(--card-bg)]">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">

          {submitted ? (
            /* ── Success ── */
            <div className="text-center py-20" data-aos="zoom-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 mb-8">
                <CheckCircle2 size={44} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                Registration Submitted!
              </h2>
              <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-10">
                Thank you for registering with MNC Construction. Our team will review your
                application and contact you within 3–5 business days.
              </p>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-3 bg-[var(--secondary)] hover:bg-[#E1BF67] text-black font-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(213,178,93,0.3)]"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* ── Company Information ── */}
              <FormSection
                icon={Building2}
                title="Company Information"
                badge="01"
                data-aos="fade-up"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Company Name" required error={errors.companyName}>
                    <input
                      value={form.companyName}
                      onChange={e => set('companyName', e.target.value)}
                      placeholder="Your company name"
                      className={inputCls(errors.companyName)}
                    />
                  </FormField>

                  <FormField label="Contact Person" required error={errors.contactName}>
                    <input
                      value={form.contactName}
                      onChange={e => set('contactName', e.target.value)}
                      placeholder="Full name"
                      className={inputCls(errors.contactName)}
                    />
                  </FormField>

                  <FormField label="Mobile Number" required error={errors.phone}>
                    <input
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="+966 5x xxx xxxx"
                      dir="ltr"
                      className={inputCls(errors.phone)}
                    />
                  </FormField>

                  <FormField label="Email Address" required error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="email@company.com"
                      dir="ltr"
                      className={inputCls(errors.email)}
                    />
                  </FormField>

                  <FormField label="City" required error={errors.city}>
                    <input
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      placeholder="e.g. Riyadh, Jeddah"
                      className={inputCls(errors.city)}
                    />
                  </FormField>

                  <FormField label="Country" required error={errors.country}>
                    <div className="relative">
                      <select
                        value={form.country}
                        onChange={e => set('country', e.target.value)}
                        className={`${inputCls(errors.country)} appearance-none cursor-pointer pe-10`}
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => (
                          <option key={c} value={c} className="bg-black">{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>
                  </FormField>

                  <FormField label="Website" className="md:col-span-2">
                    <div className="relative">
                      <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                      <input
                        value={form.website}
                        onChange={e => set('website', e.target.value)}
                        placeholder="https://www.company.com"
                        dir="ltr"
                        className={`${inputCls()} pl-10`}
                      />
                    </div>
                  </FormField>
                </div>
              </FormSection>

              {/* ── Business Activity ── */}
              <FormSection
                icon={Briefcase}
                title="Business Activity"
                badge="02"
                className="mt-8"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <FormField label="Activity Type" required error={errors.activity}>
                  <div className="relative">
                    <select
                      value={form.activity}
                      onChange={e => set('activity', e.target.value)}
                      className={`${inputCls(errors.activity)} appearance-none cursor-pointer pe-10`}
                    >
                      <option value="">Select your primary activity</option>
                      {ACTIVITY_TYPES.map(a => (
                        <option key={a} value={a} className="bg-black">{a}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  </div>
                </FormField>
              </FormSection>

              {/* ── Offer Details ── */}
              <FormSection
                icon={FileText}
                title="Offer Details"
                badge="03"
                className="mt-8"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="space-y-5">
                  <FormField label="Products & Services Description" required error={errors.description}>
                    <textarea
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      rows={4}
                      placeholder="Describe your products, services, and capabilities..."
                      className={`${inputCls(errors.description)} resize-none`}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Brands Available">
                      <div className="relative">
                        <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        <input
                          value={form.brands}
                          onChange={e => set('brands', e.target.value)}
                          placeholder="e.g. Brand A, Brand B"
                          className={`${inputCls()} pl-10`}
                        />
                      </div>
                    </FormField>

                    <FormField label="Coverage Area">
                      <div className="relative">
                        <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        <input
                          value={form.coverageArea}
                          onChange={e => set('coverageArea', e.target.value)}
                          placeholder="e.g. Western Region, All KSA"
                          className={`${inputCls()} pl-10`}
                        />
                      </div>
                    </FormField>

                    <FormField label="Delivery Time">
                      <div className="relative">
                        <Clock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        <input
                          value={form.deliveryTime}
                          onChange={e => set('deliveryTime', e.target.value)}
                          placeholder="e.g. 2–5 business days"
                          className={`${inputCls()} pl-10`}
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Additional Notes">
                    <textarea
                      value={form.notes}
                      onChange={e => set('notes', e.target.value)}
                      rows={3}
                      placeholder="Any other information you'd like to share..."
                      className={`${inputCls()} resize-none`}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* ── Submit ── */}
              {submitError && (
                <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400 text-center">
                  {submitError}
                </div>
              )}

              <div className="mt-8 text-center" data-aos="fade-up">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-3 bg-[var(--secondary)] hover:bg-[#E1BF67] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black px-12 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(213,178,93,0.3)] hover:shadow-[0_0_50px_rgba(213,178,93,0.45)]"
                >
                  {submitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={20} /> Submit Application</>
                  )}
                </button>
                <p className="text-white/30 text-xs mt-4">
                  Fields marked with * are required
                </p>
              </div>
            </form>
          )}

        </div>
      </section>
    </main>
  );
}

/* ── Helpers ─────────────────────────────────────────── */

function FormSection({ icon: Icon, title, badge, children, className = '', ...rest }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden group ${className}`} {...rest}>
      {/* Decorative glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700 pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-secondary" />
        </div>
        <div>
          <span className="text-secondary/50 text-[10px] font-bold tracking-widest uppercase">{badge}</span>
          <h3 className="text-white font-black text-lg leading-tight">{title}</h3>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function FormField({ label, required, error, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-secondary/80 px-1 uppercase tracking-wider">
        {label}{required ? ' *' : ''}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full bg-black/40 border rounded-xl px-4 py-3.5 text-sm text-white focus:bg-black/60 outline-none transition-all duration-300 shadow-sm placeholder:text-white/25
    ${error
      ? 'border-red-500/40 focus:border-red-500/60'
      : 'border-white/10 focus:border-[var(--secondary)]'
    }`;
}
