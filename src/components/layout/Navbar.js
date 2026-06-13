"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon, Calculator, Home, Info, Briefcase, FolderOpen, PhoneCall, Globe } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { HiDocumentText } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('nav.home'),    href: "/",               icon: Home },
    { name: t('nav.about'),   href: "/us",             icon: Info },
    { name: t('nav.services'),href: "/#services",      icon: Briefcase },
    { name: t('nav.projects'),href: "/projects",       icon: FolderOpen },
    { name: t('nav.contact'), href: "/contact",        icon: PhoneCall },
    { name: t('nav.costCalc'),href: "/cost-calculator",isSpecial: true, icon: Calculator },
  ];

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const portfolioTranslations = {
    ar: { ar: 'النسخة العربية', en: 'النسخة الإنجليزية' },
    en: { ar: 'Arabic Version', en: 'English Version' },
    zh: { ar: '阿拉伯语版本', en: '英语版本' },
    es: { ar: 'Versión árabe', en: 'Versión inglesa' },
    fr: { ar: 'Version arabe', en: 'Version anglaise' },
    de: { ar: 'Arabische Version', en: 'Englische Version' },
    tr: { ar: 'Arapça Sürümü', en: 'İngilizce Sürümü' },
    ur: { ar: 'عربی ورژن', en: 'انگریزی ورژن' }
  };
  const tPortfolio = portfolioTranslations[lang] || portfolioTranslations['en'];

  return (
    <>
      {/* ===== MAIN NAVBAR ===== */}
      <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500
        ${scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-[#B8923A]/25 shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
          : "bg-black/20 backdrop-blur-sm border-b border-white/5"
        }`}>
        <div className="w-full mx-auto flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-5">

          {/* Logo */}
          <Link href="/" className="flex items-center min-w-0 sm:min-w-[140px] me-4 lg:me-6 xl:me-10">
            <Image
              src="/asstes/logo-navbar.png"
              alt="MNC Logo"
              width={240}
              height={120}
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-500"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex flex-wrap items-center justify-center gap-1.5 lg:gap-2 xl:gap-4 px-1 lg:px-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.isSpecial) {
                  return (
                    <Link key={link.name} href={link.href}
                      className={`flex items-center gap-1 text-[11px] lg:text-[12px] xl:text-[13px] font-bold px-2 lg:px-3 xl:px-4 py-1.5 xl:py-2 rounded-full transition-all duration-300 ${
                        isActive ? "bg-[#D5B25D] text-black" : "bg-[#D5B25D]/15 text-[#D5B25D] border border-[#D5B25D]/30 hover:bg-[#D5B25D]/25"
                      }`}>
                      <Calculator size={13} /><span>{link.name}</span>
                    </Link>
                  );
                }
                return (
                  <Link key={link.name} href={link.href}
                    className={`text-[12px] lg:text-[13px] xl:text-[15px] font-bold px-2 lg:px-2.5 xl:px-5 py-1.5 xl:py-2 rounded-full transition-all duration-300 relative group overflow-hidden whitespace-nowrap ${
                      isActive ? "bg-[#B8923A]/10 text-[#B8923A] border border-[#B8923A]/25" : "text-white hover:text-[#B8923A]"
                    }`}>
                    <span className="relative z-10">{link.name}</span>
                    {!isActive && <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center justify-end gap-1.5 xl:gap-2.5 min-w-[120px]">

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-1.5 group">
                <span className="flex items-center justify-center w-8 h-8 xl:w-9 xl:h-9 border border-[#B8923A]/30 text-[#B8923A] rounded-md transition-all duration-300 group-hover:bg-[#B8923A]/10 active:scale-95">
                  <HiDocumentText size={20} />
                </span>
                <span className="bg-[#B8923A] text-black px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-md font-bold text-xs xl:text-sm shadow transition-all duration-300 hover:bg-[#C9A34D] active:scale-95 flex items-center gap-1.5 whitespace-nowrap">
                  {t('nav.profile')}
                  <ChevronDown size={13} className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-[170px] bg-[#111] border border-[#B8923A]/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden z-50 ${isProfileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                <a href="/Portfolio%20MNC/ARABIC%20PORTFOLIO.pdf" target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 text-sm font-bold text-[#B8923A] hover:bg-[#B8923A]/10 transition-colors"
                  onClick={() => setIsProfileOpen(false)}>
                  {tPortfolio.ar}
                </a>
                <a href="/Portfolio%20MNC/ENGLISH%20PORTFOLIO.pdf" target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-3 text-sm font-bold text-[#B8923A] hover:bg-[#B8923A]/10 transition-colors border-t border-white/5"
                  onClick={() => setIsProfileOpen(false)}>
                  {tPortfolio.en}
                </a>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#B8923A]/30 text-[#B8923A] hover:bg-[#B8923A]/10 transition-all duration-300 overflow-hidden">
              <span className={`absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}><Sun size={18} /></span>
              <span className={`absolute transition-all duration-500 ${theme === 'dark' ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}><Moon size={18} /></span>
            </button>

            {/* Language Selector - Desktop */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#B8923A]/30 text-white hover:border-[#B8923A] hover:text-[#B8923A] transition-all duration-300 min-w-[90px]"
              >
                <span className="text-lg leading-none">{currentLang.flag}</span>
                <span className="text-xs font-black tracking-wider uppercase flex-1 text-center">{currentLang.code.toUpperCase()}</span>
                <Globe size={13} className="text-[#B8923A]/60" />
              </button>

              {/* Language Dropdown - Desktop */}
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-[260px] bg-[#0d0d0d] border border-[#B8923A]/15 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden z-50 ${isLangOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
                <div className="p-3">
                  <p className="text-[9px] text-white/25 font-medium tracking-[2px] uppercase mb-2 px-1">
                    {lang === 'ar' || lang === 'ur' ? 'اختر اللغة' : 'Select Language'}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => { setLang(language.code); setIsLangOpen(false); }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] transition-all duration-200 text-start ${
                          lang === language.code
                            ? "bg-[#B8923A]/15 border border-[#B8923A]/30 text-[#B8923A]"
                            : "hover:bg-white/5 border border-transparent text-white/60 hover:text-white"
                        }`}
                      >
                        <span className="text-xl leading-none">{language.flag}</span>
                        <div>
                          <p className="text-[12px] font-bold leading-tight">{language.nativeName}</p>
                          <p className="text-[9px] opacity-50 uppercase tracking-wide">{language.dir.toUpperCase()}</p>
                        </div>
                        {lang === language.code && (
                          <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[#B8923A] flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 rounded-full border border-[#B8923A]/30 text-white hover:bg-[#B8923A]/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE OVERLAY ===== */}
      <div
        className={`lg:hidden fixed inset-0 z-[110] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        onClick={() => setIsOpen(false)}
      />

      {/* ===== MOBILE MENU PANEL ===== */}
      <div
        className={`lg:hidden fixed top-0 bottom-0 w-full z-[120] transition-transform duration-500 ease-out ${isRTL ? 'right-0' : 'left-0'}`}
        style={{
          backgroundColor: '#0a0a0a',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          boxShadow: isRTL ? '-6px 0 50px rgba(0,0,0,1)' : '6px 0 50px rgba(0,0,0,1)',
          transform: isOpen ? 'translateX(0)' : isRTL ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      >
        <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: '#0a0a0a' }}>

          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 pt-8 pb-4 border-b border-white/5 flex-shrink-0" style={{ backgroundColor: '#0a0a0a' }}>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image src="/asstes/logo-navbar.png" alt="MNC Logo" width={90} height={45} className="h-9 w-auto object-contain" priority />
            </Link>
            <button onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-[10px] border border-[#B8923A]/25 bg-[#B8923A]/5 flex items-center justify-center text-[#B8923A] hover:bg-[#B8923A]/15 transition-all active:scale-95">
              <X size={16} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="px-3.5 pt-4 flex-shrink-0" style={{ backgroundColor: '#0a0a0a' }}>
            <p className="text-[9px] text-white/20 font-medium tracking-[2.5px] uppercase px-1.5 mb-2">
              {lang === 'ar' || lang === 'ur' ? 'القائمة' : 'Navigation'}
            </p>
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const LinkIcon = link.icon;
                if (link.isSpecial) {
                  return (
                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-[11px] px-3 rounded-[12px] border border-[#D5B25D]/25 bg-gradient-to-r from-[#D5B25D]/14 to-[#D5B25D]/7 transition-all duration-200 active:scale-[0.98]">
                      <span className="w-[34px] h-[34px] rounded-[10px] bg-[#D5B25D]/20 flex items-center justify-center text-[#D5B25D] flex-shrink-0"><LinkIcon size={15} /></span>
                      <span className="text-[13px] font-bold text-[#D5B25D] flex-1">{link.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D5B25D] flex-shrink-0" />
                    </Link>
                  );
                }
                return (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 py-[11px] px-3 rounded-[12px] border transition-all duration-200 active:scale-[0.98] ${
                      isActive ? "bg-[#B8923A]/12 border-[#B8923A]/22" : "border-transparent hover:bg-white/4"
                    }`}>
                    <span className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-[#B8923A]/15 text-[#B8923A]" : "bg-white/5 text-white/35"
                    }`}><LinkIcon size={15} /></span>
                    <span className={`text-[13px] font-semibold flex-1 ${isActive ? "text-[#B8923A]" : "text-white/70"}`}>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A] flex-shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ===== MOBILE LANGUAGE SELECTOR ===== */}
          <div className="px-3.5 pt-5 flex-shrink-0" style={{ backgroundColor: '#0a0a0a' }}>
            <button
              onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
              className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] bg-white/3 border border-white/8 hover:bg-white/6 transition-all active:scale-[0.98]"
            >
              <span className="w-[34px] h-[34px] rounded-[10px] bg-[#B8923A]/10 flex items-center justify-center flex-shrink-0">
                <Globe size={16} className="text-[#B8923A]" />
              </span>
              <div className="flex-1 text-start flex items-center gap-2">
                <span className="text-xl">{currentLang.flag}</span>
                <div>
                  <p className="text-[12px] font-bold text-white leading-none">{currentLang.nativeName}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {lang === 'ar' || lang === 'ur' ? 'اختر اللغة' : 'Select Language'}
                  </p>
                </div>
              </div>
              <ChevronDown size={14} className={`text-white/30 transition-transform duration-300 ${isMobileLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Grid - Mobile */}
            <div className={`overflow-hidden transition-all duration-400 ${isMobileLangOpen ? 'max-h-[400px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-1.5 p-1">
                {LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => { setLang(language.code); setIsMobileLangOpen(false); setIsOpen(false); }}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-[12px] border transition-all duration-200 active:scale-[0.97] ${
                      lang === language.code
                        ? "bg-[#B8923A]/12 border-[#B8923A]/25 text-[#B8923A]"
                        : "border-white/6 bg-white/3 text-white/60 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span className="text-2xl leading-none">{language.flag}</span>
                    <div className="text-start">
                      <p className="text-[12px] font-bold leading-tight">{language.nativeName}</p>
                      <p className="text-[9px] opacity-40 uppercase tracking-wide">{language.code}</p>
                    </div>
                    {lang === language.code && (
                      <span className="ms-auto w-1.5 h-1.5 rounded-full bg-[#B8923A] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" style={{ backgroundColor: '#0a0a0a' }} />

          {/* Panel Footer */}
          <div className="px-3.5 pb-7 pt-4 border-t border-white/5 flex-shrink-0 space-y-2.5" style={{ backgroundColor: '#0a0a0a' }}>

            {/* Profile */}
            <div>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] bg-[#B8923A]/6 border border-[#B8923A]/20 hover:bg-[#B8923A]/10 transition-all active:scale-[0.98]">
                <span className="w-[34px] h-[34px] rounded-[10px] bg-[#B8923A]/15 flex items-center justify-center text-[#B8923A] flex-shrink-0"><HiDocumentText size={18} /></span>
                <div className="flex-1 text-start">
                  <p className="text-[12px] font-bold text-[#B8923A] leading-none">{t('nav.profile')}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">PDF</p>
                </div>
                <ChevronDown size={13} className={`text-[#B8923A]/50 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isProfileOpen ? "max-h-28 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="grid grid-cols-2 gap-2">
                  <a href="/Portfolio%20MNC/ARABIC%20PORTFOLIO.pdf" target="_blank" rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold text-[#B8923A] border border-[#B8923A]/20 py-2.5 rounded-[10px] hover:bg-[#B8923A]/10 transition-colors text-center bg-white/3">
                    {tPortfolio.ar}
                  </a>
                  <a href="/Portfolio%20MNC/ENGLISH%20PORTFOLIO.pdf" target="_blank" rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold text-[#B8923A] border border-[#B8923A]/20 py-2.5 rounded-[10px] hover:bg-[#B8923A]/10 transition-colors text-center bg-white/3">
                    {tPortfolio.en}
                  </a>
                </div>
              </div>
            </div>

            {/* Theme */}
            <button onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[12px] bg-white/3 border border-white/8 hover:bg-white/6 transition-colors">
              <span className="w-[34px] h-[34px] rounded-[10px] bg-white/5 flex items-center justify-center text-[#B8923A] flex-shrink-0">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </span>
              <span className="text-[12px] font-semibold text-white/60">
                {theme === 'dark'
                  ? (lang === 'ar' || lang === 'ur' ? 'وضع النهار' : 'Light Mode')
                  : (lang === 'ar' || lang === 'ur' ? 'وضع الليل' : 'Dark Mode')}
              </span>
            </button>

            <p className="text-center text-[9px] text-white/15 font-medium uppercase tracking-[0.15em] pt-1">
              © {new Date().getFullYear()} MNC Construction
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
