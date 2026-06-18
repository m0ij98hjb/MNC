'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

/* Deterministic stars — same on server + client, no hydration mismatch */
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 97) + 1.5,
  y: ((i * 53 + 7) % 93) + 2.5,
  r: (i % 3) * 0.65 + 0.4,
  opacity: ((i % 5) * 0.025 + 0.04),
  dur: ((i % 4) * 0.7 + 2.3).toFixed(1),
  delay: ((i % 7) * 0.35).toFixed(1),
}));

export default function AdminLoginPage() {
  const { user, login, error, setError } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  if (user) { router.replace('/admin/dashboard'); return null; }

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
      {/* Twinkle keyframes */}
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: var(--star-o,0.06); }
          50%      { opacity: calc(var(--star-o,0.06) * 4); }
        }
        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1); }
          50%  { transform: translateY(-8px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>

      {/* ── Stars / Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STARS.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-[#C9A34D]"
            style={{
              left: `${s.x}%`,
              top:  `${s.y}%`,
              width:  `${s.r * 2}px`,
              height: `${s.r * 2}px`,
              '--star-o': s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Geometric diagonal pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#C9A34D 0px,#C9A34D 1px,transparent 1px,transparent 90px)' }}
      />

      {/* ── Accent lines ── */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A34D] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A34D]/30 to-transparent" />

      {/* ── Ambient glows ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-[#C9A34D]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/5 w-[280px] h-[280px] bg-[#1a3a5c]/50 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[250px] h-[250px] bg-[#C9A34D]/4 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[430px] px-5 sm:px-6 py-10">

        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
          {/* Logo with glow halo */}
          <div
            className="relative mb-7"
            style={{ animation: 'float-up 5s ease-in-out infinite' }}
          >
            <div className="absolute inset-0 rounded-full blur-3xl scale-125"
              style={{ background: 'radial-gradient(ellipse,rgba(201,163,77,0.18) 0%,transparent 70%)' }}
            />
            <Image
              src="/asstes/logo-navbar.png"
              alt="MNC Logo"
              width={300}
              height={150}
              className="relative h-24 sm:h-28 xl:h-32 w-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 bg-[#C9A34D]/8 border border-[#C9A34D]/20 rounded-full px-4 py-1.5 mb-3">
            <ShieldCheck size={13} className="text-[#C9A34D]" />
            <span className="text-[11px] font-bold text-[#C9A34D] tracking-wider uppercase">
              {t('admin.loginTitle')}
            </span>
          </div>

          <p className="text-sm text-white/35 font-medium tracking-wide text-center">
            {t('admin.loginSubtitle')}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-2.5 mt-5">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C9A34D]/35" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-[#C9A34D]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A34D]/60" />
              <div className="w-1 h-1 rounded-full bg-[#C9A34D]/40" />
            </div>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C9A34D]/35" />
          </div>
        </div>

        {/* ── Form card ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 sm:p-8 space-y-5 backdrop-blur-sm"
          style={{
            background: 'rgba(8,18,30,0.88)',
            border: '1px solid rgba(201,163,77,0.22)',
            boxShadow: '0 0 0 1px rgba(201,163,77,0.07), 0 28px 70px rgba(0,0,0,0.75), 0 0 50px rgba(201,163,77,0.07)',
          }}
        >
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/22 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
              {t('admin.loginError')}
            </div>
          )}

          {/* Email */}
          <div>
            <label className={`block text-[11px] font-bold text-[#C9A34D]/55 mb-2 uppercase tracking-[1.5px] ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.emailLabel')}
            </label>
            <div className="relative">
              <Mail size={14} className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-[#C9A34D]/40`} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="admin@mnc.com"
                className={`w-full rounded-xl py-3.5 text-white text-sm placeholder:text-white/18 focus:outline-none transition-all duration-300
                  ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}
                  bg-white/[0.04] border border-white/10 focus:border-[#C9A34D]/50 focus:bg-white/[0.07]`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[11px] font-bold text-[#C9A34D]/55 mb-2 uppercase tracking-[1.5px] ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.passwordLabel')}
            </label>
            <div className="relative">
              <Lock size={14} className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-[#C9A34D]/40`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError?.(''); }}
                required
                dir="ltr"
                placeholder="••••••••"
                className={`w-full rounded-xl py-3.5 text-white text-sm placeholder:text-white/18 focus:outline-none transition-all duration-300
                  ${isRTL ? 'pr-11 pl-11' : 'pl-11 pr-11'}
                  bg-white/[0.04] border border-white/10 focus:border-[#C9A34D]/50 focus:bg-white/[0.07]`}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-white/25 hover:text-[#C9A34D]/70 transition-colors`}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-black py-4 rounded-xl text-[13px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 mt-1 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg,#B8923A 0%,#E8C97A 50%,#B8923A 100%)',
              color: '#000',
              boxShadow: '0 4px 24px rgba(201,163,77,0.4)',
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? t('admin.loggingIn') : t('admin.loginBtn')}
          </button>
        </form>

        {/* Copyright */}
        <p className="text-center text-white/12 text-[10px] mt-7 uppercase tracking-[3px] font-medium">
          MNC Construction © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
