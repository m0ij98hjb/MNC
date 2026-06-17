"use client";

import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { BarChart3, MessageCircle, FileText, Bell, Star } from "lucide-react";

/* ─── Translations ─────────────────────────────────────────── */
const C = {
  ar: {
    badge: "تطبيق الجوال الرسمي",
    title1: "حمّل تطبيق",
    title2: "MNC",
    desc: "تابع مشاريعك، تواصل مع فريقنا الهندسي، واستعرض وثائقك في أي وقت ومن أي مكان.",
    soon: "قريباً",
    stat1n: "١٢+", stat1l: "مشروع نشط",
    stat2n: "٥٠٠+", stat2l: "عميل راضٍ",
    stat3n: "١٥+", stat3l: "سنة خبرة",
    featuresBadge: "لماذا التطبيق؟",
    featuresTitle: "كل شيء في جيبك",
    features: [
      { icon: BarChart3,     title: "متابعة المشاريع",  desc: "تتبّع نسب الإنجاز لحظةً بلحظة مع تقارير مرئية دقيقة وتحديثات آنية." },
      { icon: MessageCircle, title: "التواصل المباشر",  desc: "تحدّث مع فريق MNC الهندسي مباشرةً في أي وقت دون انتظار." },
      { icon: FileText,      title: "عرض المستندات",    desc: "استعرض العقود والمخططات الهندسية والتقارير من هاتفك فوراً." },
      { icon: Bell,          title: "إشعارات فورية",    desc: "احصل على تنبيهات آنية لكل تحديث أو تغيير في مشروعك." },
    ],
    ctaBadge: "ابدأ الآن",
    ctaTitle: "جاهز لتجربة تطبيق MNC؟",
    ctaDesc: "حمّل التطبيق الآن وابدأ إدارة مشاريعك بأسلوب احترافي جديد.",
    ratingLabel: "٤.٩ تقييم التطبيق",
  },
  en: {
    badge: "Official Mobile App",
    title1: "Download",
    title2: "MNC App",
    desc: "Track your projects, communicate with our engineering team, and access documents anytime, anywhere.",
    soon: "Coming Soon",
    stat1n: "12+", stat1l: "Active Projects",
    stat2n: "500+", stat2l: "Happy Clients",
    stat3n: "15+", stat3l: "Years of Experience",
    featuresBadge: "Why the App?",
    featuresTitle: "Everything in Your Pocket",
    features: [
      { icon: BarChart3,     title: "Project Tracking",      desc: "Monitor your project progress in real-time with precise visual reports." },
      { icon: MessageCircle, title: "Direct Communication",  desc: "Talk directly with the MNC engineering team anytime without waiting." },
      { icon: FileText,      title: "Document Viewer",       desc: "Access contracts, blueprints, and reports instantly from your phone." },
      { icon: Bell,          title: "Instant Notifications", desc: "Get real-time alerts for every update or change in your project." },
    ],
    ctaBadge: "Get Started",
    ctaTitle: "Ready to experience MNC App?",
    ctaDesc: "Download the app now and start managing your projects in a new professional way.",
    ratingLabel: "4.9 App Rating",
  },
};

const FEAT_COLORS = ["#C9A34D", "#60a5fa", "#34d399", "#f472b6"];

/* ─── Apple Icon ──────────────────────────────────────────── */
function AppleIcon({ size = 22, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/* ─── Google Play Colorful Icon ────────────────────────────── */
function GooglePlayColorIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      {/* Left / top-left — Cyan */}
      <path d="M3 21.5V2.5L14.5 12Z" fill="#32BBFF" />
      {/* Bottom — Yellow/Orange */}
      <path d="M3 21.5L14.5 12L17.5 15L5.8 22Z" fill="#FFBC00" />
      {/* Top — Green */}
      <path d="M3 2.5L14.5 12L17.5 9L5.8 2Z" fill="#1BE874" />
      {/* Right tip — Red */}
      <path d="M17.5 9L14.5 12L17.5 15L21 13.1C21.9 12.6 21.9 11.4 21 10.9Z" fill="#FF4747" />
    </svg>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function AppPage() {
  const { lang, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLightMode = theme === 'dark';
  const isAr = lang === "ar" || lang === "ur";
  const c = C[isAr ? "ar" : "en"];
  const ta = isRTL ? "text-right" : "text-left";

  return (
    <main className={`min-h-screen font-cairo ${isLightMode ? 'bg-[#f8fafc]' : 'bg-[#0D1B2A]'}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="image-hero relative min-h-screen flex items-center pt-24 top-10 sm:pt-28 pb-16 sm:pb-20 overflow-hidden">

        {/* ── Background image ── */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/asstes/hero-app.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* Light overlay — let the image breathe */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(4,13,24,0.45) 0%,rgba(7,22,38,0.30) 50%,rgba(4,13,24,0.50) 100%)" }} />
          {/* Top border line */}
          <div className="absolute top-0 left-0 w-full h-[2px]"
            style={{ background: "linear-gradient(90deg,transparent,rgba(201,163,77,0.5),transparent)" }} />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl">
          {/* Two columns — image on left, text on right */}
          <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-14 lg:gap-12 xl:gap-20" style={{ direction: "ltr" }}>

            {/* ────────────────────────────────────────────────
                IMAGE COLUMN (LEFT)
            ──────────────────────────────────────────────── */}
            <div className="relative flex-shrink-0 flex items-center justify-center lg:justify-start order-2 lg:order-1">

              {/* Background glow rings */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-[#C9A34D]/8 pointer-events-none" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-[#C9A34D]/12 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(201,163,77,0.13) 0%, transparent 65%)" }} />

              {/* Floating card — top right */}
              <div className="absolute -top-6 -right-8 z-20 bg-[#0a1828]/90 border border-[#C9A34D]/25 rounded-2xl px-4 py-3 backdrop-blur-md shadow-2xl hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C9A34D]/15 border border-[#C9A34D]/25 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={14} className="text-[#C9A34D]" />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">{isAr ? "٧٥٪ منجز" : "75% Done"}</div>
                    <div className="text-white/40 text-[10px]">{isAr ? "مشروع BARJIS" : "BARJIS Project"}</div>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[#C9A34D] rounded-full" />
                </div>
              </div>

              {/* Floating card — bottom left */}
              <div className="absolute -bottom-4 -left-6 z-20 bg-[#0a1828]/90 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md shadow-2xl hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Bell size={13} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">{isAr ? "إشعار جديد" : "New Notification"}</div>
                    <div className="text-white/40 text-[10px]">{isAr ? "تحديث المشروع" : "Project Update"}</div>
                  </div>
                </div>
              </div>

              {/* App screenshot — framed */}
              <div className="relative z-10">
                {/* Outer glow */}
                <div className="absolute inset-[-18px] rounded-[2.8rem] pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at center, rgba(201,163,77,0.18) 0%, transparent 70%)" }} />
                {/* Frame border */}
                <div
                  className="relative rounded-[1.6rem] sm:rounded-[2.4rem] p-[4px] sm:p-[5px]"
                  style={{
                    background: "linear-gradient(145deg,rgba(201,163,77,0.55) 0%,rgba(201,163,77,0.10) 40%,rgba(255,255,255,0.06) 60%,rgba(201,163,77,0.35) 100%)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,163,77,0.15) inset, 0 8px 32px rgba(201,163,77,0.12)",
                  }}
                >
                  {/* Inner container with rounded clip */}
                  <div className="rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden"
                    style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.5) inset" }}>
                    <Image
                      src="/asstes/Appph.png"
                      alt="MNC App"
                      width={480}
                      height={500}
                      className="w-[230px] xs:w-[260px] sm:w-[340px] lg:w-[440px] xl:w-[480px] h-auto block"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ────────────────────────────────────────────────
                TEXT COLUMN (RIGHT)
            ──────────────────────────────────────────────── */}
            <div className={`flex-1 ${ta} order-1 lg:order-2`} dir={isRTL ? "rtl" : "ltr"}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 border border-[#C9A34D]/35 bg-[#C9A34D]/8 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
                <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.2em] uppercase">{c.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-[2rem] xs:text-4xl sm:text-5xl lg:text-[4.5rem] xl:text-7xl font-black text-white leading-[1.06] mb-5 sm:mb-6">
                {c.title1}
                <br />
                <span className="relative inline-block">
                  <span className="text-[#C9A34D]">{c.title2}</span>
                  <span
                    className="absolute left-0 -bottom-2 w-full h-[3px] rounded-full"
                    style={{ background: "linear-gradient(90deg,#C9A34D,rgba(201,163,77,0.2))" }}
                  />
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/55 text-[0.92rem] sm:text-[1.05rem] leading-relaxed sm:max-w-[420px] mb-8 sm:mb-10">{c.desc}</p>

              {/* ── Store Buttons ── */}
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
                {/* App Store — official black */}
                <button className="group flex items-center justify-center gap-3 bg-black text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-300 hover:bg-[#111] hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full xs:w-auto">
                  <AppleIcon size={26} />
                  <div className="text-start leading-none">
                    <div className="text-[9px] text-white/45 uppercase tracking-[0.15em] mb-0.5">{c.soon}</div>
                    <div className="text-[15px] font-black">App Store</div>
                  </div>
                </button>

                {/* Google Play — official black + color icon */}
                <button className="group flex items-center justify-center gap-3 bg-[#1a1a1a] text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-300 hover:bg-[#222] hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full xs:w-auto">
                  <GooglePlayColorIcon size={26} />
                  <div className="text-start leading-none">
                    <div className="text-[9px] text-white/45 uppercase tracking-[0.15em] mb-0.5">{c.soon}</div>
                    <div className="text-[15px] font-black">Google Play</div>
                  </div>
                </button>

              </div>

              {/* ── Stars + Rating ── */}
              <div className={`flex items-center gap-3 mb-8 sm:mb-12 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#C9A34D] fill-[#C9A34D]" />
                  ))}
                </div>
                <span className="text-white/40 text-xs sm:text-sm font-medium">{c.ratingLabel}</span>
              </div>

              {/* ── Stats row ── */}
              <div className={`flex gap-5 sm:gap-8 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                {[
                  { n: c.stat1n, l: c.stat1l },
                  { n: c.stat2n, l: c.stat2l },
                  { n: c.stat3n, l: c.stat3l },
                ].map((s, i) => (
                  <div key={i} className={`${ta}`}>
                    <div className="text-xl sm:text-2xl font-black text-white">{s.n}</div>
                    <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section className={`py-16 sm:py-20 lg:py-28 relative overflow-hidden ${isLightMode ? 'bg-[#f0f4f8]' : ''}`}>
        {/* Separator line */}
        <div className="absolute top-0 left-0 w-full h-[1px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(201,163,77,0.2),transparent)" }} />
        {/* Background tint — dark mode only */}
        {!isLightMode && (
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg,rgba(9,19,32,0.7) 0%,rgba(13,27,42,0) 100%)" }} />
        )}

        <div className="relative container mx-auto px-6 max-w-7xl">

          {/* Section header */}
          <div className={`${ta} mb-10 lg:mb-16`}>
            <div className="inline-flex items-center gap-2.5 border border-[#C9A34D]/25 bg-[#C9A34D]/6 rounded-full px-5 py-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
              <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.2em] uppercase">{c.featuresBadge}</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black ${isLightMode ? 'text-[#1e293b]' : 'text-white'}`}>{c.featuresTitle}</h2>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.features.map((feat, i) => {
              const Icon = feat.icon;
              const color = FEAT_COLORS[i];
              return (
                <div
                  key={i}
                  className="group relative rounded-3xl p-5 sm:p-7 transition-all duration-500 hover:-translate-y-2 cursor-default"
                  style={isLightMode ? {
                    background: "#ffffff",
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  } : {
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `linear-gradient(135deg,${color}0c,transparent 60%)`, border: `1px solid ${color}28` }}
                  />

                  {/* Number badge */}
                  <div className="absolute top-5 right-5 text-[10px] font-black opacity-15 group-hover:opacity-40 transition-opacity duration-300"
                    style={{ color }}>
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ width: 52, height: 52, background: `${color}12`, border: `1px solid ${color}28` }}
                  >
                    <Icon size={23} style={{ color }} />
                  </div>

                  <h3 className={`font-black text-[17px] mb-3 leading-snug ${ta} ${isLightMode ? 'text-[#1e293b]' : 'text-white'}`}>{feat.title}</h3>
                  <p className={`text-sm leading-relaxed ${ta} ${isLightMode ? 'text-slate-500' : 'text-white/42'}`}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DOWNLOAD CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg,rgba(13,27,42,0) 0%,rgba(9,19,32,0.5) 100%)" }} />

        <div className="relative container mx-auto max-w-5xl">
          <div
            className="relative rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden text-center py-12 px-5 sm:py-16 sm:px-8 md:py-20"
            style={isLightMode ? {
              background: "#ffffff",
              border: "1px solid rgba(201,163,77,0.30)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            } : {
              background: "linear-gradient(135deg,#091522 0%,#0D1B2A 40%,#0f2035 70%,#091522 100%)",
              border: "1px solid rgba(201,163,77,0.20)",
              boxShadow: "0 0 0 1px rgba(201,163,77,0.06) inset, 0 30px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Gold radial glow — center */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(201,163,77,0.10) 0%, transparent 65%)" }} />
            {/* Top-right warm glow */}
            <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(201,163,77,0.12) 0%, transparent 55%)" }} />
            {/* Bottom-left cool glow */}
            <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(13,27,42,0.9) 0%, transparent 70%)" }} />
            {/* Fine diagonal lines */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(201,163,77,1) 0,rgba(201,163,77,1) 1px,transparent 1px,transparent 40px)" }} />
            {/* Top shimmer */}
            <div className="absolute top-0 left-[8%] right-[8%] h-[1px]"
              style={{ background: "linear-gradient(90deg,transparent,rgba(201,163,77,0.6),transparent)" }} />
            {/* Bottom shimmer */}
            <div className="absolute bottom-0 left-[20%] right-[20%] h-[1px]"
              style={{ background: "linear-gradient(90deg,transparent,rgba(201,163,77,0.25),transparent)" }} />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-[#C9A34D]/10 border border-[#C9A34D]/25 rounded-full px-5 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
                <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.2em] uppercase">{c.ctaBadge}</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-5 leading-tight ${isLightMode ? 'text-[#1e293b]' : 'text-white'}`}>{c.ctaTitle}</h2>
              <p className={`text-base sm:text-lg max-w-lg mx-auto mb-10 sm:mb-14 leading-relaxed ${isLightMode ? 'text-slate-500' : 'text-white/45'}`}>{c.ctaDesc}</p>

              {/* Buttons — same style as hero */}
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center">

                {/* App Store */}
                <button className={`group flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_30px_rgba(0,0,0,0.4)] w-full xs:w-auto ${isLightMode ? 'bg-slate-900 border-slate-700' : 'bg-black border-white/10 hover:bg-[#111]'}`}>
                  <AppleIcon size={26} color="#ffffff" />
                  <div className="text-start leading-none">
                    <div className="text-[9px] uppercase tracking-[0.15em] mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.soon}</div>
                    <div className="text-[15px] font-black" style={{ color: '#ffffff' }}>App Store</div>
                  </div>
                </button>

                {/* Google Play */}
                <button className={`group flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_8px_30px_rgba(0,0,0,0.4)] w-full xs:w-auto ${isLightMode ? 'bg-slate-800 border-slate-700' : 'bg-[#1a1a1a] border-white/10 hover:bg-[#222]'}`}>
                  <GooglePlayColorIcon size={26} />
                  <div className="text-start leading-none">
                    <div className="text-[9px] uppercase tracking-[0.15em] mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.soon}</div>
                    <div className="text-[15px] font-black" style={{ color: '#ffffff' }}>Google Play</div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
