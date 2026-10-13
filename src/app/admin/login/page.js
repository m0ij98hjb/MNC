'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const { user, login, error, setError } = useAuth();
  const { t, isRTL } = useLanguage();
  const { getDashboard, loading: roleLoading } = useRoleAccess();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  // Redirect based on role after login
  useEffect(() => {
    if (user && !roleLoading) {
      const dashboard = getDashboard();
      router.replace(dashboard);
    }
  }, [user, roleLoading, router, getDashboard]);

  if (user) { return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-12"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-[420px]">

        {/* ── Card ── */}
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
          {/* brand accent */}
          <div aria-hidden="true" className="h-1 w-full bg-[#f2a624]" />

          <div className="px-7 sm:px-10 pt-9 pb-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/asstes/mnc-logo-2026-clean.png"
                alt="MNC Construction"
                width={857}
                height={310}
                className="h-11 w-auto object-contain"
                priority
              />
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f2a624] mb-2">
                <ShieldCheck size={13} strokeWidth={2.5} />
                {t('admin.loginTitle')}
              </p>
              <h1 className="text-[22px] font-black text-[#0f172a] leading-tight">
                {t('admin.loginSubtitle')}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] leading-relaxed bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{t('admin.loginError')}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="admin-email" className="block text-[13px] font-semibold text-[#334155]">
                  {t('admin.emailLabel')}
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    aria-hidden="true"
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none`}
                  />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError?.(''); }}
                    required
                    dir="ltr"
                    placeholder="name@mnc.sa"
                    className={`login-input w-full h-12 rounded-xl bg-white border border-slate-300 text-[15px] text-[#0f172a] placeholder:text-[#94a3b8] ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="admin-password" className="block text-[13px] font-semibold text-[#334155]">
                  {t('admin.passwordLabel')}
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    aria-hidden="true"
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none`}
                  />
                  <input
                    id="admin-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError?.(''); }}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    className={`login-input w-full h-12 rounded-xl bg-white border border-slate-300 text-[15px] text-[#0f172a] placeholder:text-[#94a3b8] ${isRTL ? 'pr-11 pl-12 text-right' : 'pl-11 pr-12'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] hover:bg-slate-100 transition-colors`}
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-[#f2a624] text-[#0f172a] text-[15px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-10px_rgba(242,166,36,0.9)] hover:brightness-95 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f2a624]/30"
              >
                {loading && <Loader2 size={17} className="animate-spin" />}
                {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-[#94a3b8]">
          <Lock size={12} aria-hidden="true" />
          MNC Construction © {new Date().getFullYear()}
        </p>
      </div>

      <style>{`
        /* doubled class beats the site-wide border/input overrides */
        .login-input.login-input { border-color: #cbd5e1 !important; transition: border-color .15s, box-shadow .15s; }
        .login-input.login-input:hover { border-color: #94a3b8 !important; }
        .login-input.login-input:focus { outline: none; border-color: #f2a624 !important; box-shadow: 0 0 0 4px rgba(242,166,36,0.18) !important; }
      `}</style>
    </div>
  );
}
