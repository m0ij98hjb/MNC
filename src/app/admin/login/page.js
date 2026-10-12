'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
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
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <style>{`
        .login-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .login-input:focus { border-color: #B8923A !important; box-shadow: 0 0 0 3px rgba(213,178,93,0.18) !important; outline: none; }
      `}</style>

      {/* ── Faint gold grid (same blueprint motif as the site) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(184,146,58,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(184,146,58,0.07) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
        }}
      />

      {/* ── Top gold accent line ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-[3px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg,transparent,#B8923A 35%,#D5B25D 50%,#B8923A 65%,transparent)' }}
      />

      <div className="relative z-10 w-full max-w-[420px] px-5 py-10">

        {/* Logo + title */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/asstes/logo-navbar-v2.png"
            alt="MNC"
            width={280}
            height={140}
            className="h-20 sm:h-24 w-auto object-contain mb-6"
            priority
          />

          <div className="flex items-center gap-2 rounded-full px-4 py-1.5 mb-3 bg-[#D5B25D]/10 border border-[#D5B25D]/30">
            <ShieldCheck size={13} className="text-[#7F611B]" />
            <span className="text-[11px] font-black uppercase tracking-[2px] text-[#7F611B]">
              {t('admin.loginTitle')}
            </span>
          </div>

          <p className="text-[14px] text-[#475569] text-center font-medium">
            {t('admin.loginSubtitle')}
          </p>
        </div>

        {/* ── Form card ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 sm:p-8 space-y-5 bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
        >
          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-center bg-red-50 border border-red-200 text-red-700">
              {t('admin.loginError')}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-[1.5px] mb-2 text-[#475569] ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.emailLabel')}
            </label>
            <div className="relative">
              <Mail
                size={15}
                className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]`}
              />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="admin@mnc.com"
                className={`login-input w-full rounded-xl py-3.5 text-sm bg-white border border-slate-300 text-[#0f172a] placeholder:text-[#94a3b8]
                  ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-[1.5px] mb-2 text-[#475569] ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.passwordLabel')}
            </label>
            <div className="relative">
              <Lock
                size={15}
                className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]`}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="••••••••"
                className={`login-input w-full rounded-xl py-3.5 text-sm bg-white border border-slate-300 text-[#0f172a] placeholder:text-[#94a3b8]
                  ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 transition-colors duration-200 text-[#94a3b8] hover:text-[#7F611B]`}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3.5 rounded-xl text-[13px] font-black tracking-[2px] uppercase flex items-center justify-center gap-2.5 bg-[#D5B25D] text-[#0f172a] hover:bg-[#C9A34D] shadow-[0_10px_24px_-10px_rgba(184,146,58,0.55)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
          </button>
        </form>

        <p className="text-center text-[10px] font-medium mt-6 uppercase tracking-[3px] text-[#94a3b8]">
          MNC Construction © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
