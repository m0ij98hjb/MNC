"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "من نحن", href: "/us" },
    { name: "خدماتنا", href: "/#services" },
    { name: "مشاريعنا", href: "/projects" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <nav className="fixed w-full z-50 transition-all duration-500 flex justify-center px-6 top-4">
      <div className={`w-full max-w-7xl flex justify-between items-center px-8 py-3 backdrop-blur-md rounded-full shadow-2xl transition-colors duration-500 border border-white/10 ${scrolled ? "bg-[#eaeaea]/95" : "bg-transparent"}`}>

        {/* Logo Section */}
        <Link href="/" className="flex items-center min-w-[120px]">
          <Image
            src="https://marwannazer.com/wp-content/uploads/2018/05/أللوقو-الرئيسي.png"
            alt="MNC Logo"
            width={100}
            height={50}
            className="h-10 w-auto object-contain transition-all duration-500"
            priority
          />
        </Link>

        {/* Centered Desktop Links */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-1 rtl:space-x-reverse px-2 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-bold px-6 py-2 rounded-full transition-all duration-300 relative group overflow-hidden text-secondary hover:bg-white/5"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="hidden md:flex items-center justify-end gap-3 min-w-[150px]">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-secondary text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronDown size={14} className={`mt-0.5 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
              <span className="text-sm font-bold font-heading">العربية</span>
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full mt-2 right-0 w-full min-w-[120px] bg-primary/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${isLangOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
              <button
                className="w-full text-center px-4 py-3 text-sm font-bold text-white/80 hover:text-secondary hover:bg-white/5 transition-colors"
                onClick={() => setIsLangOpen(false)}
              >
                English
              </button>
            </div>
          </div>

          <Button variant="primary" size="sm" className="flex items-center gap-2 font-bold shadow-lg shadow-secondary/20">
            <Download size={14} />
            البروفايل
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (Glassmorphism Overlay) */}
      <div
        className={`md:hidden fixed inset-x-6 top-24 glass-morphism rounded-3xl transition-all duration-500 overflow-hidden shadow-2xl border border-white/10 ${isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="flex flex-col p-8 space-y-6 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-2xl font-black text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="primary" className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2">
            <Download size={20} />
            تحميل الملف التعريفي
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
