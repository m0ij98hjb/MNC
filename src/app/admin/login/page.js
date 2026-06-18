'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const { user, login, error, setError } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) router.replace('/admin/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-cairo"
      style={{ background: '#0D1B2A' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Geometric diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A34D 0px, #C9A34D 1px, transparent 1px, transparent 80px)' }}
      />
      {/* Gold top accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A34D] to-transparent" />
      {/* Center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#C9A34D]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 py-12">

        {/* MNC Logo + title */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/asstes/logo-navbar.png"
            alt="MNC Logo"
            width={180}
            height={90}
            className="h-16 w-auto object-contain mb-6"
            priority
          />
          <h1 className="text-xl font-black text-white tracking-wide">{t('admin.loginTitle')}</h1>
          <p className="text-sm text-white/40 mt-1.5">{t('admin.loginSubtitle')}</p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#C9A34D] to-transparent mt-4" />
        </div>

        {/* Login form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,163,77,0.15)' }}
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
              {t('admin.loginError')}
            </div>
          )}

          {/* Email */}
          <div>
            <label className={`block text-xs text-white/50 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.emailLabel')}
            </label>
            <div className="relative">
              <Mail
                size={15}
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`}
              />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="admin@mnc.com"
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A34D]/50 transition-colors`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs text-white/50 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.passwordLabel')}
            </label>
            <div className="relative">
              <Lock
                size={15}
                className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-white/30`}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="••••••••"
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A34D]/50 transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors`}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-black py-3.5 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
            style={{ background: '#C9A34D', color: '#000' }}
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
          </button>
        </form>

        <p className="text-center text-white/15 text-[10px] mt-6 uppercase tracking-widest">
          © {new Date().getFullYear()} MNC Construction
        </p>
      </div>
    </div>
  );
}
