'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { LogOut, LayoutDashboard, ChevronDown, Globe, Bell, Briefcase, Building2, ExternalLink } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';

const PAGE_TITLES = {
  '/admin/dashboard':      'لوحة التحكم',
  '/admin/suppliers':      'الموردون',
  '/admin/suppliers/best': 'أفضل الموردين',
  '/admin/approved':       'الموردون المقبولون',
  '/admin/jobs':           'طلبات التوظيف',
  '/admin/jobs/approved':  'المقبولون للمقابلة',
  '/admin/jobs/best':      'أفضل المرشحين',
  '/admin/reports':        'التقارير والإحصائيات',
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { lang, setLang } = useLanguage();
  const { logout } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const bellRef = useRef(null);

  const { allNotifications = [], unreadCount = 0, markBellOpened } = useNotifications() ?? {};

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
    PAGE_TITLES[pathname] ??
    (pathname.startsWith('/admin/suppliers/') ? 'تفاصيل المورد' : 'لوحة التحكم');

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      style={{
        height: '72px',
        background: '#0D1B2A',
        boxShadow: '0 4px 32px rgba(0,0,0,0.55)',
      }}
      dir="rtl"
    >
      <div className="h-full flex items-center px-4 sm:px-6 lg:px-8 gap-2 sm:gap-3">

        {/* ── RIGHT: Logo ── */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/asstes/logo-navbar.png"
            alt="MNC"
            width={180}
            height={90}
            className="h-10 sm:h-11 w-auto object-contain"
            priority
          />
        </Link>

        <div className="w-px h-5 bg-[#C9A34D]/20 flex-shrink-0" />

        {/* ── CENTER: ADMIN PANEL label + page name ── */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0">
          <p className="text-[8px] font-black tracking-[5px] uppercase leading-none"
            style={{ color: 'rgba(201,163,77,0.30)' }}>
            ADMIN PANEL
          </p>
          <p className="text-[13px] sm:text-[14px] font-bold text-white/88 leading-none truncate">
            {pageTitle}
          </p>
        </div>

        <div className="w-px h-5 bg-[#C9A34D]/20 flex-shrink-0" />

        {/* ── LEFT: Actions ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* مدير الشركة badge + dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserOpen(v => !v)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#C9A34D]/20 hover:border-[#C9A34D]/40 hover:bg-[#C9A34D]/7 transition-all duration-250 active:scale-95"
            >
              <div
                className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.45)' }}
              >
                <Image src="/asstes/directort.png" alt="Director" fill sizes="28px" className="object-cover object-top" />
              </div>
              <div className="hidden sm:block text-end leading-none">
                <p className="text-[11px] font-bold text-[#C9A34D] leading-none">مدير الشركة</p>
              </div>
              <ChevronDown size={10} className={`text-[#C9A34D]/40 transition-transform duration-300 ${isUserOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User dropdown — opens to the LEFT (left-0 in RTL context) */}
            <div
              className={`absolute top-[calc(100%+8px)] left-0 w-[205px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isUserOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.16)', boxShadow: '0 20px 60px rgba(0,0,0,0.88)' }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid rgba(201,163,77,0.10)' }}>
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.4)' }}>
                  <Image src="/asstes/directort.png" alt="Director" fill sizes="36px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-white leading-none">مدير الشركة</p>
                  <p className="text-[9px] text-[#C9A34D]/50 mt-0.5 uppercase tracking-wide">ADMIN</p>
                </div>
              </div>
              <Link href="/admin/dashboard" onClick={() => setIsUserOpen(false)}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-white/55 hover:text-white hover:bg-white/5 transition-colors">
                <LayoutDashboard size={13} className="text-[#C9A34D] flex-shrink-0" />
                لوحة التحكم
              </Link>
              <div className="h-px mx-3 bg-white/[0.05]" />
              <button onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-red-400/55 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                <LogOut size={13} className="flex-shrink-0" />
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Bell */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => {
                const opening = !isBellOpen;
                setIsBellOpen(opening);
                if (opening && markBellOpened) markBellOpened();
              }}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-[#C9A34D]/20 text-white/50 hover:text-white/90 hover:bg-[#C9A34D]/8 hover:border-[#C9A34D]/38 transition-all duration-250 active:scale-95 flex-shrink-0"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 min-w-[17px] h-[17px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center leading-none shadow-lg shadow-red-500/40">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <div
              className={`absolute top-[calc(100%+10px)] left-0 w-[310px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isBellOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.88)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <p className="text-white text-xs font-bold">الإشعارات</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">{unreadCount} جديد</span>
                )}
              </div>
              <div className="max-h-[340px] overflow-y-auto divide-y divide-white/[0.05]">
                {allNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={20} className="text-white/10 mx-auto mb-2" />
                    <p className="text-white/25 text-xs">لا توجد إشعارات جديدة</p>
                  </div>
                ) : allNotifications.map(n => (
                  <Link key={n.id}
                    href={n.type === 'supplier' ? `/admin/suppliers/${n.id}` : '/admin/jobs'}
                    onClick={() => setIsBellOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'supplier' ? 'bg-blue-500/12 border border-blue-500/25' : 'bg-[#c8a96e]/12 border border-[#c8a96e]/25'}`}>
                      {n.type === 'supplier' ? <Building2 size={12} className="text-blue-400" /> : <Briefcase size={12} className="text-[#c8a96e]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{n.type === 'supplier' ? n.companyName : n.fullName}</p>
                      <p className="text-white/40 text-[11px] mt-0.5 truncate">
                        {n.type === 'supplier' ? `طلب مورد · ${n.activity || ''}` : `طلب وظيفة · ${n.position || ''}`}
                      </p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]/50 shrink-0 mt-2" />
                  </Link>
                ))}
              </div>
              {allNotifications.length > 0 && (
                <div className="border-t border-white/[0.06] px-4 py-2.5 flex gap-2">
                  <Link href="/admin/suppliers" onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors font-semibold">الموردون</Link>
                  <div className="w-px bg-white/10" />
                  <Link href="/admin/jobs" onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors font-semibold">الوظائف</Link>
                </div>
              )}
            </div>
          </div>

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-2 rounded-lg border border-[#C9A34D]/20 hover:border-[#C9A34D]/40 hover:bg-[#C9A34D]/7 text-white/50 hover:text-white/85 transition-all duration-250"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase">{currentLang.code.toUpperCase()}</span>
              <Globe size={10} className="text-[#C9A34D]/38" />
            </button>
            <div
              className={`absolute top-[calc(100%+8px)] left-0 w-[238px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isLangOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.85)' }}
            >
              <div className="p-2.5">
                <p className="text-[9px] text-white/20 uppercase tracking-[2.5px] font-medium mb-2 px-1">اختر اللغة</p>
                <div className="grid grid-cols-2 gap-1">
                  {LANGUAGES.map((language) => (
                    <button key={language.code}
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
                      {lang === language.code && <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[#C9A34D] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ← الموقع الرئيسي — dashed gold border */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-250 active:scale-95 whitespace-nowrap hover:bg-[#C9A34D]/10"
            style={{ color: '#C9A34D', border: '1px dashed rgba(201,163,77,0.55)' }}
          >
            <ExternalLink size={11} />
            الموقع الرئيسي
          </a>

        </div>
      </div>

      {/* ── Gold bottom separator ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1.5px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,163,77,0.15) 15%, rgba(201,163,77,0.6) 40%, rgba(201,163,77,0.7) 50%, rgba(201,163,77,0.6) 60%, rgba(201,163,77,0.15) 85%, transparent 100%)',
        }}
      />
    </header>
  );
}
