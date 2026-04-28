"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { HiDocumentText } from "react-icons/hi";
import { MdLanguage } from "react-icons/md";
import Button from "../ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, toggleLanguage, t } = useLanguage();

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
    <nav className="fixed w-full z-[100] transition-all duration-500 flex justify-center px-2 sm:px-4 md:px-6 top-2 sm:top-5">
      <div className={`w-full max-w-7xl flex justify-between items-center px-4 sm:px-6 md:px-10 py-1 sm:py-2 backdrop-blur-md rounded-full shadow-2xl transition-all duration-500 border border-white/10 ${scrolled ? "bg-[#eaeaea]/95 shadow-secondary/10" : "bg-transparent"}`}>

        {/* Logo Section */}
        <Link href="/" className="flex items-center min-w-0 sm:min-w-[120px]">
          <Image
            src="https://marwannazer.com/wp-content/uploads/2018/05/أللوقو-الرئيسي.png"
            alt="MNC Logo"
            width={120}
            height={60}
            className="h-4 sm:h-8 md:h-10 lg:h-12 w-auto object-contain transition-all duration-500"
            priority
          />
        </Link>

        {/* Centered Desktop Links */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-1 rtl:space-x-reverse px-2 rounded-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm xl:text-base font-bold px-2 lg:px-3 xl:px-6 py-2 rounded-full transition-all duration-300 relative group overflow-hidden ${isActive ? "bg-secondary/10 text-secondary border border-secondary/20 shadow-sm" : "text-secondary hover:bg-white/5"}`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {!isActive && (
                    <span className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="hidden lg:flex items-center justify-end gap-3 min-w-[150px]">
          <Link
            href="https://marwannazer.com/bro-Final.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <span className="flex items-center justify-center w-10 h-10 bg-white/5 text-secondary rounded-xl transition-all duration-300 group-hover:text-gold group-hover:-translate-y-0.5 active:scale-95">
              <HiDocumentText size={22} />
            </span>
            <span className="bg-secondary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-secondary/20 transition-all duration-300 group-hover:bg-gold group-hover:-translate-y-0.5 active:scale-95">
              {t('nav.profile')}
            </span>
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary/30 bg-white/5 hover:bg-secondary hover:text-white transition-all duration-300 ${scrolled ? "text-secondary" : "text-white"}`}
            >
              <MdLanguage size={18} className="opacity-80" />
              <span className="text-xs font-black tracking-widest uppercase">{lang === 'ar' ? 'AR' : 'EN'}</span>
              <ChevronDown size={12} className={`mt-0.5 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full mt-2 right-0 w-full min-w-[120px] bg-white border border-secondary/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${isLangOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <button
                className="w-full text-center px-4 py-3 text-sm font-bold text-secondary hover:text-primary hover:bg-slate-50 transition-colors"
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
          className={`lg:hidden p-2 rounded-full transition-colors ${scrolled || isOpen ? "text-primary bg-black/5 hover:bg-black/10" : "text-white bg-white/10 hover:bg-white/20"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`lg:hidden fixed ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] transition-transform duration-500 ease-out shadow-2xl ${isOpen ? "translate-x-0" : lang === 'ar' ? "translate-x-full" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-8 pt-24 relative">
          {/* Close button inside panel */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 left-8 p-2 rounded-full bg-slate-100 text-primary hover:bg-slate-200 transition-colors"
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
                  className={`text-xl font-bold py-4 px-6 rounded-2xl transition-all ${isActive
                    ? "bg-secondary/10 text-secondary border border-secondary/20"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto space-y-4">
            <Link
              href="https://marwannazer.com/bro-Final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group w-full"
            >
              <span className="flex items-center justify-center w-14 h-14 bg-slate-50 text-secondary rounded-2xl transition-all active:scale-95">
                <HiDocumentText size={28} />
              </span>
              <span className="flex-1 bg-secondary text-white py-4 rounded-2xl font-bold text-base text-center shadow-xl shadow-secondary/20 transition-all active:scale-95">
                {t('nav.profile')}
              </span>
            </Link>

            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="w-full text-base font-bold text-slate-600 border border-slate-200 py-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
            >
              <MdLanguage size={20} className="text-secondary" />
              <span>{lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
              <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-md uppercase font-black ml-1">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-4">
              © {new Date().getFullYear()} MNC Construction
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
