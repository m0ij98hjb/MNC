"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { HiDocumentText } from "react-icons/hi";
import { MdLanguage } from "react-icons/md";
import Button from "../ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/us" },
    { name: t('nav.services'), href: "/#services" },
    { name: t('nav.projects'), href: "/projects" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  return (
    <nav className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500
      ${scrolled
        ? "bg-black/90 backdrop-blur-xl border-b border-[#B8923A]/25 shadow-[0_4px_40px_rgba(0,0,0,0.6)]"
        : "bg-black/20 backdrop-blur-sm border-b border-white/5"
      }`}>
      <div className={`w-full mx-auto flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-5 transition-all duration-500`}>

        {/* Logo Section */}
        <Link href="/" className="flex items-center min-w-0 sm:min-w-[140px] mr-6 lg:mr-10">
          <Image
            src="/asstes/logo13.png"
            alt="MNC Logo"
            width={240}
            height={120}
            className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain transition-all duration-500"
            priority
          />
        </Link>

        {/* Centered Desktop Links */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-1 rtl:space-x-reverse px-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-bold px-2 lg:px-3 xl:px-6 py-2 rounded-full transition-all duration-300 relative group overflow-hidden whitespace-nowrap ${
                    isActive
                      ? "bg-[#B8923A]/10 text-[#B8923A] border border-[#B8923A]/25 shadow-sm"
                      : "text-white hover:text-[#B8923A]"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {!isActive && (
                    <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="hidden lg:flex items-center justify-end gap-2 min-w-[120px]">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 group"
            >
              <span className="flex items-center justify-center w-9 h-9 border border-[#B8923A]/30 text-[#B8923A] rounded-md transition-all duration-300 group-hover:bg-[#B8923A]/10 active:scale-95">
                <HiDocumentText size={22} />
              </span>
              <span className="bg-[#B8923A] text-black px-4 py-2 rounded-md font-bold text-sm shadow transition-all duration-300 hover:bg-[#C9A34D] active:scale-95 flex items-center gap-2">
                {t('nav.profile')}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            <div className={`absolute top-full mt-2 right-0 w-[170px] bg-[#111] border border-[#B8923A]/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${isProfileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <a
                href="/Portfolio%20MNC/ARABIC%20PORTFOLIO.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 text-sm font-bold text-[#B8923A] hover:bg-[#B8923A]/10 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                {lang === 'ar' ? 'النسخة العربية' : 'Arabic Version'}
              </a>
                <a
                href="/Portfolio%20MNC/ENGLISH%20PORTFOLIO.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 text-sm font-bold text-[#B8923A] hover:bg-[#B8923A]/10 transition-colors border-t border-white/5"
                onClick={() => setIsProfileOpen(false)}
              >
                {lang === 'ar' ? 'النسخة الإنجليزية' : 'English Version'}
              </a>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#B8923A]/30 text-[#B8923A] hover:bg-[#B8923A]/10 transition-all duration-300 overflow-hidden"
            title={theme === 'dark' ? 'وضع النهار' : 'وضع الليل'}
          >
            <span className={`absolute transition-all duration-500 ${
              theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
            }`}>
              <Sun size={18} />
            </span>
            <span className={`absolute transition-all duration-500 ${
              theme === 'dark' ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}>
              <Moon size={18} />
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#B8923A]/30 text-white hover:border-[#B8923A] hover:text-[#B8923A] transition-all duration-300"
            >
              <MdLanguage size={18} className="text-[#B8923A] opacity-80" />
              <span className="text-xs font-black tracking-widest uppercase">{lang === 'ar' ? 'AR' : 'EN'}</span>
              <ChevronDown size={12} className={`mt-0.5 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full mt-2 right-0 w-full min-w-[120px] bg-[#111] border border-[#B8923A]/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${isLangOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <button
                className="w-full text-center px-4 py-3 text-sm font-bold text-[#B8923A] hover:bg-[#B8923A]/10 transition-colors"
                onClick={() => {
                  setLang(lang === 'ar' ? 'en' : 'ar');
                  setIsLangOpen(false);
                }}
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
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

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 w-[85%] max-w-sm bg-[#0a0a0a] z-[70] transition-transform duration-500 ease-out shadow-2xl ${isOpen ? "translate-x-0" : lang === 'ar' ? "translate-x-full" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-8 pt-24 relative">
          {/* Close button inside panel */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 left-8 p-2 rounded-full border border-[#B8923A]/20 text-white hover:bg-[#B8923A]/10 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1 mt-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xl font-bold py-4 px-6 rounded-2xl transition-all ${
                    isActive
                      ? "bg-[#B8923A]/10 text-[#B8923A] border border-[#B8923A]/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto space-y-4">
            {/* Mobile Profile Downloads */}
            <div className="w-full">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 group w-full"
              >
                <span className="flex items-center justify-center w-14 h-14 border border-[#B8923A]/20 text-[#B8923A] rounded-2xl transition-all active:scale-95">
                  <HiDocumentText size={28} />
                </span>
                <span className="flex-1 flex items-center justify-center gap-2 bg-[#B8923A] text-black py-4 rounded-2xl font-bold text-base shadow-xl transition-all active:scale-95">
                  {t('nav.profile')}
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isProfileOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col gap-2 pl-16 rtl:pl-0 rtl:pr-16">
                  <a
                    href="/Portfolio%20MNC/ARABIC%20PORTFOLIO.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-sm font-bold text-[#B8923A] border border-[#B8923A]/20 py-3 rounded-xl hover:bg-[#B8923A]/10 transition-colors text-center"
                  >
                    {lang === 'ar' ? 'النسخة العربية' : 'Arabic Version'}
                  </a>
                  <a
                    href="/Portfolio%20MNC/ENGLISH%20PORTFOLIO.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-sm font-bold text-[#B8923A] border border-[#B8923A]/20 py-3 rounded-xl hover:bg-[#B8923A]/10 transition-colors text-center"
                  >
                    {lang === 'ar' ? 'النسخة الإنجليزية' : 'English Version'}
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full text-base font-bold text-white/70 border border-white/10 py-4 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
            >
              <span className="text-[#B8923A]">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </span>
              <span>{theme === 'dark' ? (lang === 'ar' ? 'وضع النهار' : 'Light Mode') : (lang === 'ar' ? 'وضع الليل' : 'Dark Mode')}</span>
            </button>

            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="w-full text-base font-bold text-white/70 border border-white/10 py-4 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
            >
              <MdLanguage size={20} className="text-[#B8923A]" />
              <span>{lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
              <span className="bg-[#B8923A]/15 text-[#B8923A] text-[10px] px-2 py-0.5 rounded-md uppercase font-black ml-1">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <p className="text-center text-[10px] text-white/20 font-medium uppercase tracking-[0.2em] mt-4">
              © {new Date().getFullYear()} MNC Construction
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;