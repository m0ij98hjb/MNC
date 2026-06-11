"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { lang, t } = useLanguage();

  const links = {
    company: [
      { label: lang === "ar" ? "من نحن" : "About Us", href: "/us" },
      { label: lang === "ar" ? "مشاريعنا" : "Projects", href: "/projects" },
      { label: lang === "ar" ? "خدماتنا" : "Services", href: "/#services" },
      { label: lang === "ar" ? "تواصل معنا" : "Contact Us", href: "/contact" },
    ],
    services: [
      { label: lang === "ar" ? "مشاريع المقاولات" : "Contracting" },
      { label: lang === "ar" ? "التصميم المعماري" : "Architectural Design" },
      { label: lang === "ar" ? "إدارة المشاريع" : "Project Management" },
      { label: lang === "ar" ? "التصميم الداخلي" : "Interior Design" },
    ],
  };

  return (
    <footer
      className="bg-[#0f0e0b] text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* ── TOP DIVIDER ─────────────────────────────── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#B8923A] to-transparent" />

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Image
              src="/asstes/logoFooter.png"
              alt="MNC Logo"
              width={120}
              height={52}
              className="w-auto object-contain opacity-90"
              priority
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {lang === "ar"
                ? "مؤسسة مروان أحمد ناظر للمقاولات العامة — نبني بصمتنا في عالم الإنشاء بأعلى معايير الجودة والاحترافية منذ أكثر من ١٥ عاماً."
                : "Marwan Ahmed Nazer General Contracting — Building our mark in construction with the highest standards of quality and professionalism for over 15 years."}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-1">
              {[
                { icon: "X", href: "#" },
                { icon: "in", href: "#" },
                { icon: "📷", href: "#" },
                { icon: "▶", href: "#" },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  className="w-9 h-9 rounded-full border border-[#B8923A]/30 flex items-center justify-center
                    text-slate-400 text-xs hover:border-[#B8923A] hover:text-[#B8923A] transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#B8923A] font-bold text-sm tracking-widest uppercase">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#B8923A] to-transparent" />
            <ul className="flex flex-col gap-3">
              {links.company.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-slate-400 text-sm hover:text-[#B8923A] transition-colors duration-200
                      flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#B8923A]/40 group-hover:bg-[#B8923A] transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#B8923A] font-bold text-sm tracking-widest uppercase">
              {lang === "ar" ? "خدماتنا" : "Services"}
            </h4>
            <div className="w-8 h-[2px] bg-gradient-to-r from-[#B8923A] to-transparent" />
            <ul className="flex flex-col gap-3">
              {links.services.map((s) => (
                <li
                  key={s.label}
                  className="text-slate-400 text-sm flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[#B8923A]/40" />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────── */}
      <div className="border-t border-white/5">
        <div
          className="max-w-7xl mx-auto px-6 py-5
          flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()}&nbsp;
            {lang === "ar"
              ? "مؤسسة مروان أحمد ناظر — جميع الحقوق محفوظة"
              : "Marwan Nazer Construction — All Rights Reserved"}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A] animate-pulse" />
            <span className="text-slate-500 text-xs">
              {lang === "ar"
                ? "جدة، المملكة العربية السعودية"
                : "Jeddah, Saudi Arabia"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
