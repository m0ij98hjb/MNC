'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Shield, LogOut, LayoutDashboard, ChevronDown, Globe, Bell, Briefcase, Building2 } from 'lucide-react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';

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

  const [isLangOpen, setIsLangOpen]   = useState(false);
  const [isUserOpen, setIsUserOpen]   = useState(false);
  const [isBellOpen, setIsBellOpen]   = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const bellRef = useRef(null);

  const { allNew, unreadCount, markSeen } = useNotifications() ?? { allNew: [], unreadCount: 0, markSeen: () => {} };

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

  const titleKey = PAGE_TITLE_KEYS[pathname]
    ?? (pathname.startsWith('/admin/suppliers/') ? 'admin.supplierDetail' : null);
  const pageTitle = titleKey ? t(titleKey) : '';
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      style={{
        height: '92px',
        background: '#0D1B2A',
        borderBottom: '1px solid rgba(201,163,77,0.22)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="h-full flex items-center px-4 sm:px-6 lg:px-8 gap-3">

        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/asstes/logo-navbar.png"
            alt="MNC"
            width={200}
            height={100}
            className="h-11 sm:h-13 lg:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Separator ── */}
        <div className="hidden sm:block w-px h-6 bg-[#C9A34D]/15 flex-shrink-0" />

        {/* ── Current Page Title ── */}
        <div className="flex-1 flex items-center justify-center">
          {pageTitle && (
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block h-3.5 w-px bg-[#C9A34D]/25 rounded-full" />
              <span className="text-[13px] sm:text-[14px] font-bold text-white/55 tracking-wide">
                {pageTitle}
              </span>
              <div className="hidden sm:block h-3.5 w-px bg-[#C9A34D]/25 rounded-full" />
            </div>
          )}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-2 rounded-lg border border-[#C9A34D]/18 hover:border-[#C9A34D]/38 hover:bg-[#C9A34D]/7 text-white/50 hover:text-white/80 transition-all duration-250"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-[10px] font-bold tracking-widest uppercase">
                {currentLang.code.toUpperCase()}
              </span>
              <Globe size={10} className="text-[#C9A34D]/38" />
            </button>

            <div
              className={`absolute top-[calc(100%+8px)] ${isRTL ? 'left-0' : 'right-0'} w-[238px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isLangOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.85)' }}
            >
              <div className="p-2.5">
                <p className="text-[9px] text-white/20 uppercase tracking-[2.5px] font-medium mb-2 px-1">
                  {isRTL ? 'اختر اللغة' : 'Select Language'}
                </p>
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

          {/* ── Bell Notifications ── */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setIsBellOpen(v => !v)}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[#C9A34D]/22 text-white/50 hover:text-white hover:bg-white/6 hover:border-white/20 transition-all duration-250 active:scale-95 flex-shrink-0"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center leading-none shadow-lg shadow-red-500/40">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Bell dropdown */}
            <div
              className={`absolute top-[calc(100%+10px)] ${isRTL ? 'left-0' : 'right-0'} w-[320px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isBellOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.14)', boxShadow: '0 20px 60px rgba(0,0,0,0.88)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <p className="text-white text-xs font-bold">الإشعارات</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">
                    {unreadCount} جديد
                  </span>
                )}
              </div>

              {/* List */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-white/[0.05]">
                {allNew.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={22} className="text-white/10 mx-auto mb-2" />
                    <p className="text-white/25 text-xs">لا توجد إشعارات جديدة</p>
                  </div>
                ) : allNew.map(n => (
                  <Link
                    key={n.id}
                    href={n.type === 'supplier' ? `/admin/suppliers/${n.id}` : '/admin/jobs'}
                    onClick={() => { markSeen(n.id); setIsBellOpen(false); }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'supplier' ? 'bg-blue-500/12 border border-blue-500/25' : 'bg-[#c8a96e]/12 border border-[#c8a96e]/25'}`}>
                      {n.type === 'supplier'
                        ? <Building2 size={13} className="text-blue-400" />
                        : <Briefcase size={13} className="text-[#c8a96e]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">
                        {n.type === 'supplier' ? n.companyName : n.fullName}
                      </p>
                      <p className="text-white/40 text-[11px] mt-0.5 truncate">
                        {n.type === 'supplier' ? `طلب مورد جديد · ${n.activity || ''}` : `طلب وظيفة · ${n.position || ''}`}
                      </p>
                      <p className="text-white/20 text-[10px] mt-0.5" dir="ltr">
                        {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString('en-GB') : ''}
                      </p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-1.5" />
                  </Link>
                ))}
              </div>

              {/* Footer */}
              {allNew.length > 0 && (
                <div className="border-t border-white/[0.06] px-4 py-2.5 flex gap-2">
                  <Link href="/admin/suppliers" onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-blue-400/70 hover:text-blue-400 transition-colors font-semibold">
                    الموردون
                  </Link>
                  <div className="w-px bg-white/10" />
                  <Link href="/admin/jobs" onClick={() => setIsBellOpen(false)}
                    className="flex-1 text-center text-[11px] text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors font-semibold">
                    الوظائف
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Shield → dashboard */}
          <Link
            href="/admin/dashboard"
            title={t('admin.dashboard')}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#C9A34D]/22 text-[#C9A34D] hover:bg-[#C9A34D]/12 hover:border-[#C9A34D]/42 transition-all duration-250 active:scale-95 flex-shrink-0"
          >
            <Shield size={16} />
          </Link>

          {/* Director photo + name + dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserOpen(v => !v)}
              className="flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#C9A34D]/18 hover:border-[#C9A34D]/38 hover:bg-[#C9A34D]/6 transition-all duration-250 active:scale-95"
            >
              {/* Director round photo */}
              <div
                className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.45)' }}
              >
                <Image
                  src="/asstes/directort.png"
                  alt="Director"
                  fill
                  sizes="32px"
                  className="object-cover object-top"
                />
              </div>
              {/* Name + role — hidden on small mobile */}
              <div className="hidden sm:block text-start leading-none">
                <p className="text-[11.5px] font-bold text-[#C9A34D] leading-none">{t('admin.managerTitle')}</p>
                <p className="text-[9px] text-white/28 mt-0.5 uppercase tracking-widest">{t('admin.adminRole')}</p>
              </div>
              <ChevronDown size={11} className={`text-[#C9A34D]/40 transition-transform duration-300 ${isUserOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute top-[calc(100%+8px)] ${isRTL ? 'left-0' : 'right-0'} w-[200px] rounded-2xl overflow-hidden z-50 transition-all duration-250 ${
                isUserOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
              style={{ background: '#0b1320', border: '1px solid rgba(201,163,77,0.16)', boxShadow: '0 20px 60px rgba(0,0,0,0.88)' }}
            >
              {/* Director info header */}
              <div
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: '1px solid rgba(201,163,77,0.1)' }}
              >
                <div
                  className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                  style={{ boxShadow: '0 0 0 1.5px rgba(201,163,77,0.4)' }}
                >
                  <Image src="/asstes/directort.png" alt="Director" fill sizes="40px" className="object-cover object-top" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-white leading-none truncate">{t('admin.managerTitle')}</p>
                  <p className="text-[9.5px] text-[#C9A34D]/50 mt-0.5 uppercase tracking-wide">{t('admin.adminRole')}</p>
                </div>
              </div>

              <Link
                href="/admin/dashboard"
                onClick={() => setIsUserOpen(false)}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-white/55 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard size={13} className="text-[#C9A34D] flex-shrink-0" />
                {t('admin.dashboard')}
              </Link>
              <div className="h-px mx-3 bg-white/[0.05]" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-semibold text-red-400/55 hover:text-red-400 hover:bg-red-500/5 transition-colors"
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
