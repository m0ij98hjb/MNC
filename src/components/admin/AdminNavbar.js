'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Shield, LogOut, LayoutDashboard, ChevronDown, Globe } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

const PAGE_TITLE_KEYS = {
  '/admin/dashboard': 'admin.dashboard',
  '/admin/suppliers': 'admin.suppliersMenu',
  '/admin/approved':  'admin.approvedMenu',
  '/admin/reports':   'admin.reportsMenu',
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { t, lang, setLang, isRTL } = useLanguage();
  const { logout } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setIsLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setIsUserOpen(false);
    await logout();
    router.replace('/admin/login');
  };

  const titleKey = PAGE_TITLE_KEYS[pathname]
    ?? (pathname.startsWith('/admin/suppliers/') ? 'admin.supplierDetail' : null);
  const pageTitle = titleKey ? t(titleKey) : '';
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      style={{
        height: '92px',
        /* Gradient from slightly lighter navy → darker — makes it pop against black pages */
        background: 'linear-gradient(180deg, #162133 0%, #0e1a28 100%)',
        /* Gold bottom border — thicker + brighter for visibility */
        borderBottom: '2px solid rgba(213,178,93,0.45)',
        /* Top accent strip */
        borderTop: '2px solid rgba(213,178,93,0.18)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.85), 0 2px 0 rgba(213,178,93,0.12)',
        backdropFilter: 'blur(12px)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Gold glow line directly below border */}
      <div
        className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(213,178,93,0.35) 35%,rgba(225,191,103,0.6) 50%,rgba(213,178,93,0.35) 65%,transparent 100%)' }}
      />

      <div className="h-full flex items-center px-4 sm:px-6 lg:px-8 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0 group">
          <Image
            src="/asstes/logo-navbar.png"
            alt="MNC"
            width={200}
            height={100}
            className="h-12 sm:h-14 w-auto object-contain group-hover:opacity-85 transition-opacity"
            priority
          />
        </Link>

        {/* ── Vertical divider ── */}
        <div
          className="hidden sm:block flex-shrink-0 w-px h-8"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(213,178,93,0.25),transparent)' }}
        />

        {/* ── Current Page Title (center) ── */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {pageTitle && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block h-1 w-1 rounded-full bg-[#D5B25D]/50" />
              <span
                className="text-sm sm:text-[15px] font-bold tracking-wide truncate"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                {pageTitle}
              </span>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-[#D5B25D]/50" />
            </div>
          )}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* ── Language selector ── */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-200 group"
              style={{
                border: '1px solid rgba(213,178,93,0.2)',
                background: isLangOpen ? 'rgba(213,178,93,0.08)' : 'transparent',
              }}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-[11px] font-bold text-white/60 group-hover:text-white/90 tracking-widest uppercase transition-colors">
                {currentLang.code.toUpperCase()}
              </span>
              <Globe size={10} style={{ color: 'rgba(213,178,93,0.5)' }} />
            </button>

            {/* Language dropdown */}
            <div
              className={`absolute top-[calc(100%+10px)] ${isRTL ? 'left-0' : 'right-0'} w-[240px] rounded-2xl overflow-hidden z-50 transition-all duration-200 ${
                isLangOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                background: '#0d1520',
                border: '1px solid rgba(213,178,93,0.18)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
              }}
            >
              <div className="p-3">
                <p className="text-[9px] text-white/25 uppercase tracking-[2.5px] font-medium mb-2.5 px-1">
                  {isRTL ? 'اختر اللغة' : 'Select Language'}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {LANGUAGES.map(language => (
                    <button
                      key={language.code}
                      onClick={() => { setLang(language.code); setIsLangOpen(false); }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-start transition-all duration-150 ${
                        lang === language.code
                          ? 'border text-[#D5B25D]'
                          : 'border border-transparent text-white/40 hover:bg-white/5 hover:text-white/75'
                      }`}
                      style={lang === language.code ? { background: 'rgba(213,178,93,0.1)', borderColor: 'rgba(213,178,93,0.25)' } : {}}
                    >
                      <span className="text-lg leading-none">{language.flag}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold leading-tight truncate">{language.nativeName}</p>
                        <p className="text-[8px] opacity-35 uppercase tracking-wide">{language.dir.toUpperCase()}</p>
                      </div>
                      {lang === language.code && (
                        <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[#D5B25D] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Shield → dashboard ── */}
          <Link
            href="/admin/dashboard"
            title={t('admin.dashboard')}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
            style={{ border: '1px solid rgba(213,178,93,0.28)', color: '#D5B25D' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(213,178,93,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Shield size={17} />
          </Link>

          {/* ── Director photo + dropdown ── */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserOpen(v => !v)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-200 active:scale-[0.98]"
              style={{
                border: '1px solid rgba(213,178,93,0.22)',
                background: isUserOpen ? 'rgba(213,178,93,0.07)' : 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Director photo */}
              <div
                className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 0 0 1.5px rgba(213,178,93,0.5), 0 0 8px rgba(213,178,93,0.2)' }}
              >
                <Image
                  src="/asstes/director.jpg"
                  alt="Director"
                  fill
                  sizes="32px"
                  className="object-cover object-top"
                />
              </div>
              {/* Name + role */}
              <div className="hidden sm:block text-start leading-none">
                <p className="text-[12px] font-bold leading-none" style={{ color: '#D5B25D' }}>
                  {t('admin.managerTitle')}
                </p>
                <p className="text-[9px] text-white/35 mt-0.5 uppercase tracking-widest">
                  {t('admin.adminRole')}
                </p>
              </div>
              <ChevronDown
                size={12}
                className={`transition-transform duration-250 flex-shrink-0`}
                style={{ color: 'rgba(213,178,93,0.45)', transform: isUserOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* User dropdown */}
            <div
              className={`absolute top-[calc(100%+10px)] ${isRTL ? 'left-0' : 'right-0'} w-[204px] rounded-2xl overflow-hidden z-50 transition-all duration-200 ${
                isUserOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                background: '#0d1520',
                border: '1px solid rgba(213,178,93,0.18)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid rgba(213,178,93,0.1)' }}>
                <div
                  className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{ boxShadow: '0 0 0 1.5px rgba(213,178,93,0.45)' }}
                >
                  <Image src="/asstes/director.jpg" alt="Director" fill sizes="40px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-white leading-none truncate">{t('admin.managerTitle')}</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-wide" style={{ color: 'rgba(213,178,93,0.5)' }}>{t('admin.adminRole')}</p>
                </div>
              </div>

              <Link
                href="/admin/dashboard"
                onClick={() => setIsUserOpen(false)}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-white/55 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard size={13} style={{ color: '#D5B25D' }} className="flex-shrink-0" />
                {t('admin.dashboard')}
              </Link>

              <div className="h-px mx-3 bg-white/[0.04]" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <LogOut size={13} className="flex-shrink-0" />
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
