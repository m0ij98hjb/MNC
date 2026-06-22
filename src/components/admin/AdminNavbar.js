'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  LogOut, LayoutDashboard, ChevronDown, Globe,
  Bell, Briefcase, Building2, ExternalLink,
} from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useDirectorPhoto } from '@/hooks/useDirectorPhoto';

/* Page titles always in Arabic regardless of app language */
const PAGE_TITLES_AR = {
  '/admin/dashboard':      'لوحة التحكم',
  '/admin/suppliers':      'الموردون',
  '/admin/suppliers/best': 'أفضل الموردين',
  '/admin/approved':       'الموردون المقبولون',
  '/admin/jobs':           'طلبات التوظيف',
  '/admin/jobs/approved':  'المقبولون للمقابلة',
  '/admin/jobs/best':      'أفضل المرشحين',
  '/admin/reports':        'التقارير والإحصائيات',
};

/* Thin gold vertical divider */
function GoldSep() {
  return (
    <div
      className="flex-shrink-0 self-stretch my-2.5"
      style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(201,163,77,0.35) 30%, rgba(201,163,77,0.35) 70%, transparent)' }}
    />
  );
}

export default function AdminNavbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { logout, isSuperAdmin } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const bellRef = useRef(null);

  const { allNotifications = [], unreadCount = 0, markBellOpened } = useNotifications() ?? {};
  const directorPhoto = useDirectorPhoto();
  const displayPhoto = isSuperAdmin ? '/asstes/super-admin.jpg' : directorPhoto;
  const displayName  = isSuperAdmin ? 'م. محمد مصطفى' : 'مدير الشركة';

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setIsLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setIsBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setIsUserOpen(false);
    await logout();
    router.replace('/admin/login');
  };

  const pageTitle =
    PAGE_TITLES_AR[pathname] ??
    (pathname.startsWith('/admin/suppliers/') ? 'تفاصيل المورد' : 'لوحة التحكم');

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      style={{
        height: '72px',
        background: '#000000',
        boxShadow: '0 2px 24px rgba(0,0,0,0.7)',
      }}
      dir="rtl"
    >
      {/* ── Main row ── */}
      <div className="h-full flex items-center px-5 lg:px-8 gap-0">

        {/* ── RIGHT: Logo ── */}
        <Link href="/" className="flex-shrink-0 pe-4">
          <Image
            src="/asstes/logo-navbar.png"
            alt="MNC"
            width={180}
            height={90}
            className="h-10 sm:h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right → Center separator */}
        <div className="w-px h-8 bg-[#C9A34D]/18 flex-shrink-0" />

        {/* ── CENTER: ADMIN PANEL + page name ── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 px-4">
          <p
            className="text-[7.5px] font-black tracking-[5px] uppercase leading-none select-none"
            style={{ color: 'rgba(201,163,77,0.28)' }}
          >
            {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN PANEL'}
          </p>
          <p
            className="text-[13px] sm:text-[14px] font-bold leading-tight truncate max-w-full"
            style={{ color: 'rgba(255,255,255,0.88)', direction: 'rtl' }}
          >
            {pageTitle}
          </p>
        </div>

        {/* Center → Left separator */}
        <div className="w-px h-8 bg-[#C9A34D]/18 flex-shrink-0" />

        {/* ── LEFT ACTIONS (RTL: first child is visually rightmost of the left group) ── */}
        <div className="flex items-center flex-shrink-0 ps-3">

          {/* 1. Manager badge + dropdown */}
          <div className="relative px-2" ref={userRef}>
            <button
              onClick={() => setIsUserOpen(v => !v)}
              className="flex items-center gap-1.5 py-1.5 px-2 rounded-xl transition-all duration-200 active:scale-95 group"
              style={{ border: '1px solid rgba(201,163,77,0.20)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,163,77,0.40)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,163,77,0.20)'}
            >
              <div
                className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.45)' }}
              >
                <Image
                  src={displayPhoto}
                  unoptimized={displayPhoto.startsWith('http')}
                  alt="Admin"
                  fill
                  sizes="28px"
                  className="object-cover object-top"
                />
              </div>
              <span className="hidden sm:block text-[11px] font-bold text-[#C9A34D] whitespace-nowrap leading-none">
                {displayName}
              </span>
              <ChevronDown
                size={10}
                className={`text-[#C9A34D]/50 transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Manager dropdown */}
            <div
              className={`absolute top-[calc(100%+10px)] left-0 w-[210px] rounded-2xl overflow-hidden z-50 transition-all duration-200 ${
                isUserOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                background: '#0a0e17',
                border: '1px solid rgba(201,163,77,0.16)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              }}
            >
              <div
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: '1px solid rgba(201,163,77,0.10)' }}
              >
                <div
                  className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                  style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.4)' }}
                >
                  <Image
                    src={displayPhoto}
                    unoptimized={displayPhoto.startsWith('http')}
                    alt="Admin"
                    fill
                    sizes="36px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-white leading-none">{displayName}</p>
                  <p className="text-[9px] text-[#C9A34D]/50 mt-0.5 uppercase tracking-widest">
                    {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/dashboard"
                onClick={() => setIsUserOpen(false)}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-white/55 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard size={13} className="text-[#C9A34D] flex-shrink-0" />
                لوحة التحكم
              </Link>
              <div className="h-px mx-3 bg-white/[0.05]" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <LogOut size={13} className="flex-shrink-0" />
                {t('admin.logout')}
              </button>
            </div>
          </div>

          <GoldSep />

          {/* 2. Bell */}
          <div className="relative px-2" ref={bellRef}>
            <button
              onClick={() => {
                const opening = !isBellOpen;
                setIsBellOpen(opening);
                if (opening && markBellOpened) markBellOpened();
              }}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0"
              style={{ border: '1px solid rgba(201,163,77,0.18)', color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,163,77,0.40)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,163,77,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none"
                  style={{ boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Bell dropdown */}
            <div
              className={`absolute top-[calc(100%+10px)] left-0 w-[310px] rounded-2xl overflow-hidden z-50 transition-all duration-200 ${
                isBellOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                background: '#0a0e17',
                border: '1px solid rgba(201,163,77,0.14)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <p className="text-white text-xs font-bold">الإشعارات</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <div className="max-h-[340px] overflow-y-auto divide-y divide-white/[0.05]">
                {allNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={20} className="text-white/10 mx-auto mb-2" />
                    <p className="text-white/25 text-xs">لا توجد إشعارات جديدة</p>
                  </div>
                ) : allNotifications.map(n => (
                  <Link
                    key={n.id}
                    href={n.type === 'supplier' ? `/admin/suppliers/${n.id}` : '/admin/jobs'}
                    onClick={() => setIsBellOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      n.type === 'supplier'
                        ? 'bg-blue-500/12 border border-blue-500/25'
                        : 'bg-[#c8a96e]/12 border border-[#c8a96e]/25'
                    }`}>
                      {n.type === 'supplier'
                        ? <Building2 size={12} className="text-blue-400" />
                        : <Briefcase size={12} className="text-[#c8a96e]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">
                        {n.type === 'supplier' ? n.companyName : n.fullName}
                      </p>
                      <p className="text-white/40 text-[11px] mt-0.5 truncate">
                        {n.type === 'supplier'
                          ? `طلب مورد · ${n.activity || ''}`
                          : `طلب وظيفة · ${n.position || ''}`}
                      </p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]/50 shrink-0 mt-2" />
                  </Link>
                ))}
              </div>
              {allNotifications.length > 0 && (
                <div className="border-t border-white/[0.06] px-4 py-2.5 flex gap-2">
                  <Link
                    href="/admin/suppliers"
                    onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors font-semibold"
                  >
                    الموردون
                  </Link>
                  <div className="w-px bg-white/10" />
                  <Link
                    href="/admin/jobs"
                    onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors font-semibold"
                  >
                    الوظائف
                  </Link>
                </div>
              )}
            </div>
          </div>

          <GoldSep />

          {/* 3. Language selector */}
          <div className="relative px-2" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-200"
              style={{ border: '1px solid rgba(201,163,77,0.18)', color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,163,77,0.40)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,163,77,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase">
                {currentLang.code.toUpperCase()}
              </span>
              <Globe size={10} style={{ color: 'rgba(201,163,77,0.45)' }} />
            </button>

            {/* Language dropdown */}
            <div
              className={`absolute top-[calc(100%+8px)] left-0 w-[238px] rounded-2xl overflow-hidden z-50 transition-all duration-200 ${
                isLangOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{
                background: '#0a0e17',
                border: '1px solid rgba(201,163,77,0.14)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.88)',
              }}
            >
              <div className="p-2.5">
                <div className="grid grid-cols-2 gap-1">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => { setLang(language.code); setIsLangOpen(false); }}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-start transition-all duration-200 ${
                        lang === language.code
                          ? 'bg-[#C9A34D]/12 border border-[#C9A34D]/22 text-[#C9A34D]'
                          : 'border border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'
                      }`}
                    >
                      <span className="text-lg leading-none">{language.flag}</span>
                      <div>
                        <p className="text-[11px] font-bold leading-tight">{language.nativeName}</p>
                        <p className="text-[8.5px] opacity-40 uppercase tracking-wide">{language.dir.toUpperCase()}</p>
                      </div>
                      {lang === language.code && (
                        <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[#C9A34D] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <GoldSep />

          {/* 4. Main site link */}
          <div className="px-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95"
              style={{
                color: '#C9A34D',
                border: '1px dashed rgba(201,163,77,0.50)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,163,77,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ExternalLink size={11} />
              الموقع الرئيسي
            </a>
          </div>

        </div>
      </div>

      {/* ── Gold bottom line ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,163,77,0.12) 10%, rgba(201,163,77,0.55) 35%, rgba(201,163,77,0.7) 50%, rgba(201,163,77,0.55) 65%, rgba(201,163,77,0.12) 90%, transparent 100%)',
        }}
      />
    </header>
  );
}
