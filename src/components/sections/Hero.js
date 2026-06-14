"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Button from "../ui/Button";
import TypewriterText from "@/components/TypewriterText";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BackgroundMusicButton from "@/components/ui/BackgroundMusicButton";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

const Hero = () => {
  const { t, lang } = useLanguage();
  const isRTL = lang === 'ar' || lang === 'ur';

  const heroImages = [
    "/hero.png",
    "/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg",
    "/asstes/office-projects/BARJIS - ROOF (05.24.2025).jpg",
    "/asstes/office-projects/BARJIS - INNER COURT (05.24.2025).jpg",
    "/asstes/office-projects/BARJIS - BACK ENTRANCE (07.07.2025).jpg",
  ];

  const successText = {
    ar: "مشروع ناجح", en: "Successful Projects", zh: "成功项目",
    es: "Proyectos exitosos", fr: "Projets réussis", de: "Erfolgreiche Projekte",
    tr: "Başarılı Proje", ur: "کامیاب منصوبے"
  }[lang] || "Successful Projects";

  const exploreText = {
    ar: "استكشف مشاريعنا", en: "Explore Projects", zh: "探索我们的项目",
    es: "Explorar proyectos", fr: "Explorer les projets", de: "Projekte erkunden",
    tr: "Projeleri Keşfet", ur: "ہمارے منصوبے دریافت کریں"
  }[lang] || "Explore Projects";

  const calcText = {
    ar: "احسب تكلفة مشروعك", en: "Calculate Your Project Cost", zh: "计算您的项目费用",
    es: "Calcular el costo de su proyecto", fr: "Calculer le coût de votre projet",
    de: "Projektkosten berechnen", tr: "Proje Maliyetinizi Hesaplayın",
    ur: "اپنے پروجیکٹ کی لاگت کا حساب لگائیں"
  }[lang] || "Calculate Your Project Cost";

  const freeText = {
    ar: "مجاني", en: "Free", zh: "免费", es: "Gratis",
    fr: "Gratuit", de: "Kostenlos", tr: "Ücretsiz", ur: "مفت"
  }[lang] || "Free";

  const descText = {
    ar: "مؤسسة مروان أحمد ناظر للمقاولات العامة - خبرة عريقة في التصميم المعماري، إدارة المشاريع، والتنفيذ الإنشائي بأعلى معايير الجودة العالمية.",
    en: "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards.",
    de: "Marwan Ahmed Nazer General Contracting - Langjährige Erfahrung in Architekturentwurf, Projektmanagement und Bauausführung nach höchsten internationalen Qualitätsstandards.",
    es: "Marwan Ahmed Nazer Contratación General - Amplia experiencia en diseño arquitectónico, gestión de proyectos y ejecución de construcción según los más altos estándares internacionales de calidad.",
    fr: "Marwan Ahmed Nazer Contracting - Une solide expertise en conception architecturale, gestion de projet et exécution de travaux selon les normes de qualité internationales les plus strictes.",
    tr: "Marwan Ahmed Nazer Genel Müteahhitlik - En yüksek uluslararası kalite standartlarında mimari tasarım, proje yönetimi ve inşaat uygulamalarında köklü uzmanlık.",
    ur: "مروان احمد ناظر جنرل کنٹریکٹنگ - اعلیٰ ترین بین الاقوامی معیار کے مطابق تعمیراتی ڈیزائن، پروجیکٹ مینجمنٹ اور تعمیل میں وسیع تجربہ۔",
    zh: "Marwan Ahmed Nazer 通用承包 - 在建筑设计、项目管理和施工执行方面拥有深厚专长，符合最高国际质量标准。"
  }[lang] || "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards.";

  return (
    <>
      {/*
        ═══════════════════════════════════════════════
        MOBILE LAYOUT  (hidden on lg+)
        ═══════════════════════════════════════════════
      */}
      <section className="lg:hidden relative min-h-screen flex flex-col overflow-hidden bg-primary">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={2000}
            loop
            className="h-full w-full"
          >
            {heroImages.map((src, idx) => (
              <SwiperSlide key={idx} className="relative h-full w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`MNC Hero Slideshow ${idx + 1}`}
                  fill
                  className="object-cover opacity-90 scale-105 animate-slow-zoom"
                  priority={idx === 0}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute inset-0 bg-black/15 z-10" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-20" />
        </div>

        {/* Main content */}
        <div className="relative z-30 flex flex-col flex-1 justify-start px-5 pt-[120px] pb-6">

          {/* Badge & Music Button Row */}
          <div className="flex items-center justify-between w-full mb-5" data-aos="fade-down" data-aos-delay="100">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              <span className="text-secondary text-xs font-bold tracking-widest uppercase">{t('hero.badge')}</span>
            </div>

            {/* Music button */}
            <div className="flex-shrink-0 z-40">
              <BackgroundMusicButton />
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight w-full"
            data-aos="fade-up" data-aos-delay="200"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            <TypewriterText
              texts={
                { ar: ["بصمة هندسية", "متميزة"], en: ["Distinctive", "Engineering Mark"],
                  zh: ["独特的", "工程印记"], es: ["Sello", "De Ingeniería Distintivo"],
                  fr: ["Empreinte", "D'ingénierie Distinctive"], de: ["Einzigartige", "Ingenieursleistung"],
                  tr: ["Belirgin", "Mühendislik İzi"], ur: ["منفرد", "انجینئرنگ نشان"]
                }[lang] || ["Distinctive", "Engineering Mark"]
              }
              typingSpeed={120} deletingSpeed={60} pauseDuration={2000} loop
              className="text-white" textClassNames={["", "text-secondary"]}
            />
          </h1>

          {/* Description */}
          <p
            className="text-sm text-white/85 font-medium mb-6 leading-relaxed"
            data-aos="fade-up" data-aos-delay="320"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
          >
            {descText}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-4" data-aos="fade-up" data-aos-delay="460">
            <Button as={Link} href="/projects" size="lg" className="flex items-center justify-center gap-2 group w-full text-sm">
              {exploreText}
              <ArrowLeft className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} size={16} />
            </Button>
            <Button as={Link} href="/us" variant="outline" size="lg" className="w-full text-sm">
              {t('nav.about')}
            </Button>
          </div>

          {/* Cost Calculator CTA */}
          <div data-aos="fade-up" data-aos-delay="580">
            <Link
              href="/cost-calculator"
              className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#D5B25D]/40 bg-[#D5B25D]/10 hover:bg-[#D5B25D]/20 hover:border-[#D5B25D]/70 transition-all duration-300 group backdrop-blur-sm w-full"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D5B25D]/20 border border-[#D5B25D]/30 flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D5B25D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
                  <path d="M16 17l2 2 4-4" strokeWidth="2"/>
                </svg>
              </span>
              <span className="text-[#D5B25D] font-bold text-sm flex-1">{calcText}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D5B25D]/20 text-[#D5B25D]/80 font-bold uppercase border border-[#D5B25D]/20 flex-shrink-0">{freeText}</span>
              <ArrowLeft size={13} className={`text-[#D5B25D]/60 flex-shrink-0 ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'} transition-transform`} />
            </Link>
          </div>
        </div>

        {/* Stats bar — bottom */}
        <div className="relative z-30 border-t border-white/10 bg-black/20">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className={`flex flex-col gap-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-xl font-black text-white leading-none">15+</span>
              <span className="text-[9px] text-white/50 uppercase tracking-widest">{t('about.experienceBadge')}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-px h-6 bg-white/20" />
              <span className="text-[#D5B25D]/30 text-[9px] font-bold tracking-[3px]">MNC</span>
              <div className="w-px h-6 bg-white/20" />
            </div>
            <div className={`flex flex-col gap-0.5 ${isRTL ? 'text-left' : 'text-right'}`}>
              <span className="text-xl font-black text-white leading-none">200+</span>
              <span className="text-[9px] text-white/50 uppercase tracking-widest">{successText}</span>
            </div>
          </div>
        </div>
      </section>

      {/*
        ═══════════════════════════════════════════════
        DESKTOP LAYOUT  (original design, hidden on < lg)
        ═══════════════════════════════════════════════
      */}
      <section id="home" className="hidden lg:flex relative h-screen min-h-[700px] items-center overflow-hidden bg-primary">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={2000}
            loop
            className="h-full w-full"
          >
            {heroImages.map((src, idx) => (
              <SwiperSlide key={idx} className="relative h-full w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`MNC Hero Slideshow ${idx + 1}`}
                  fill
                  className="object-cover opacity-90 scale-105 animate-slow-zoom"
                  priority={idx === 0}
                  unoptimized
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute inset-0 bg-black/15 z-10" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-20" />
        </div>

        {/* Desktop content container */}
        <div className="container mx-auto px-6 relative z-30">

          {/* Music button — top corner */}
          <div className={`absolute top-6 ${isRTL ? 'left-8' : 'right-8'} z-40`}>
            <BackgroundMusicButton />
          </div>

          <div className="max-w-4xl" data-aos="fade-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30 mb-8" data-aos="fade-down" data-aos-delay="200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
              </span>
              <span className="text-secondary text-sm font-bold tracking-widest uppercase">{t('hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              data-aos="fade-up" data-aos-delay="400"
              style={{ textShadow: "0 4px 16px rgba(0,0,0,0.7)" }}
            >
              <TypewriterText
                texts={
                  { ar: ["بصمة هندسية", "متميزة"], en: ["Distinctive", "Engineering Mark"],
                    zh: ["独特的", "工程印记"], es: ["Sello", "De Ingeniería Distintivo"],
                    fr: ["Empreinte", "D'ingénierie Distinctive"], de: ["Einzigartige", "Ingenieursleistung"],
                    tr: ["Belirgin", "Mühendislik İzi"], ur: ["منفرد", "انجینئرنگ نشان"]
                  }[lang] || ["Distinctive", "Engineering Mark"]
                }
                typingSpeed={120} deletingSpeed={60} pauseDuration={2000} loop
                className="text-white" textClassNames={["", "text-secondary"]}
              />
            </h1>

            {/* Description */}
            <p
              className="text-base md:text-xl text-slate-100 font-semibold mb-10 max-w-2xl leading-relaxed"
              data-aos="fade-up" data-aos-delay="600"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
            >
              {descText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-4 mb-4" data-aos="fade-up" data-aos-delay="800">
              <Button as={Link} href="/projects" size="lg" className="flex items-center justify-center gap-2 group text-base">
                {exploreText}
                <ArrowLeft className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1.5' : 'rotate-180 group-hover:translate-x-1.5'}`} />
              </Button>
              <Button as={Link} href="/us" variant="outline" size="lg" className="text-base">
                {t('nav.about')}
              </Button>
            </div>

            {/* Cost Calculator CTA */}
            <div data-aos="fade-up" data-aos-delay="1000" className="mt-4 mb-12 lg:mb-0">
              <Link
                href="/cost-calculator"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-[#D5B25D]/40 bg-[#D5B25D]/10 hover:bg-[#D5B25D]/20 hover:border-[#D5B25D]/70 transition-all duration-300 group backdrop-blur-sm"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D5B25D]/20 border border-[#D5B25D]/30 group-hover:bg-[#D5B25D]/30 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D5B25D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
                    <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>
                    <path d="M16 17l2 2 4-4" strokeWidth="2"/>
                  </svg>
                </span>
                <span className="text-[#D5B25D] font-bold text-sm">{calcText}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D5B25D]/20 text-[#D5B25D]/80 font-bold tracking-wider uppercase border border-[#D5B25D]/20">{freeText}</span>
                <ArrowLeft size={14} className={`text-[#D5B25D]/60 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Stats — original absolute positioning */}
        <div className={`absolute bottom-10 ${isRTL ? 'left-10' : 'right-10'} z-30`} data-aos="fade-up" data-aos-delay="1000">
          <div className={`flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-4xl font-bold text-white">15+</span>
            <span className="text-sm text-muted uppercase tracking-widest">{t('about.experienceBadge')}</span>
          </div>
        </div>

        <div className={`absolute bottom-10 ${isRTL ? 'right-10' : 'left-10'} z-30`} data-aos="fade-up" data-aos-delay="1200">
          <div className={`flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-4xl font-bold text-white">200+</span>
            <span className="text-sm text-muted uppercase tracking-widest">{successText}</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
