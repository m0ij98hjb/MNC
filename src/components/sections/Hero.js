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

  const heroImages = [
    "/hero.png",
    "/asstes/office-projects/BARJIS FRONT FACADE (05.08.2025).jpg",
    "/asstes/office-projects/BARJIS - ROOF (05.24.2025).jpg",
    "/asstes/office-projects/BARJIS - INNER COURT (05.24.2025).jpg",
    "/asstes/office-projects/BARJIS - BACK ENTRANCE (07.07.2025).jpg",
  ];

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-primary">
      {/* Background Slideshow using Swiper */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect={"fade"}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          speed={2000}
          loop={true}
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

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/15 z-10" />

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-30">
        {/* Background Music Toggle - Top Left/Right */}
        <div className={`absolute top-4 sm:top-6 ${lang === 'ar' || lang === 'ur' ? 'left-6 sm:left-8' : 'right-6 sm:right-8'} z-40`}>
          <BackgroundMusicButton />
        </div>

        <div className="max-w-4xl" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30 mb-8" data-aos="fade-down" data-aos-delay="200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-secondary text-sm font-bold tracking-widest uppercase">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-aos="fade-up" data-aos-delay="400" style={{ textShadow: "0 4px 16px rgba(0,0,0,0.7)" }}>
            <TypewriterText
              texts={
                {
                  ar: ["بصمة هندسية", "متميزة"],
                  en: ["Distinctive", "Engineering Mark"],
                  zh: ["独特的", "工程印记"],
                  es: ["Sello", "De Ingeniería Distintivo"],
                  fr: ["Empreinte", "D'ingénierie Distinctive"],
                  de: ["Einzigartige", "Ingenieursleistung"],
                  tr: ["Belirgin", "Mühendislik İzi"],
                  ur: ["منفرد", "انجینئرنگ نشان"]
                }[lang] || ["Distinctive", "Engineering Mark"]
              }
              typingSpeed={120}
              deletingSpeed={60}
              pauseDuration={2000}
              loop={true}
              className="text-white"
              textClassNames={["", "text-secondary"]}
            />
          </h1>

          <p className="text-base md:text-xl text-slate-100 font-semibold mb-10 max-w-2xl leading-relaxed" data-aos="fade-up" data-aos-delay="600" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
            {
              {
                ar: "مؤسسة مروان أحمد ناظر للمقاولات العامة - خبرة عريقة في التصميم المعماري، إدارة المشاريع، والتنفيذ الإنشائي بأعلى معايير الجودة العالمية.",
                en: "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards.",
                de: "Marwan Ahmed Nazer General Contracting - Langjährige Erfahrung in Architekturentwurf, Projektmanagement und Bauausführung nach höchsten internationalen Qualitätsstandards.",
                es: "Marwan Ahmed Nazer Contratación General - Amplia experiencia en diseño arquitectónico, gestión de proyectos y ejecución de construcción según los más altos estándares internacionales de calidad.",
                fr: "Marwan Ahmed Nazer Contracting - Une solide expertise en conception architecturale, gestion de projet et exécution de travaux selon les normes de qualité internationales les plus strictes.",
                tr: "Marwan Ahmed Nazer Genel Müteahhitlik - En yüksek uluslararası kalite standartlarında mimari tasarım, proje yönetimi ve inşaat uygulamalarında köklü uzmanlık.",
                ur: "مروان احمد ناظر جنرل کنٹریکٹنگ - اعلیٰ ترین بین الاقوامی معیار کے مطابق تعمیراتی ڈیزائن، پروجیکٹ مینجمنٹ اور تعمیل میں وسیع تجربہ۔",
                zh: "Marwan Ahmed Nazer 通用承包 - 在建筑设计、项目管理和施工执行方面拥有深厚专长，符合最高国际质量标准。"
              }[lang] || "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards."
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="800">
            <Button as={Link} href="/projects" size="lg" className="flex items-center justify-center gap-2 group text-sm sm:text-base">
              {
                {
                  ar: "استكشف مشاريعنا",
                  en: "Explore Projects",
                  zh: "探索我们的项目",
                  es: "Explorar proyectos",
                  fr: "Explorer les projets",
                  de: "Projekte erkunden",
                  tr: "Projeleri Keşfet",
                  ur: "ہمارے منصوبے دریافت کریں"
                }[lang] || "Explore Projects"
              }
              <ArrowLeft className={`transition-transform ${lang === 'ar' || lang === 'ur' ? 'group-hover:translate-x-[-5px]' : 'rotate-180 group-hover:translate-x-[5px]'}`} />
            </Button>
            <Button as={Link} href="/us" variant="outline" size="lg" className="text-sm sm:text-base">
              {t('nav.about')}
            </Button>
          </div>

          {/* Cost Calculator CTA Button */}
          <div data-aos="fade-up" data-aos-delay="1000" className="mt-4 mb-12 lg:mb-0">
            <Link
              href="/cost-calculator"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border border-[#D5B25D]/40 bg-[#D5B25D]/10 hover:bg-[#D5B25D]/20 hover:border-[#D5B25D]/70 transition-all duration-300 group backdrop-blur-sm"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#D5B25D]/20 border border-[#D5B25D]/30 group-hover:bg-[#D5B25D]/30 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D5B25D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/>
                  <line x1="8" y1="14" x2="12" y2="14"/>
                  <path d="M16 17l2 2 4-4" strokeWidth="2"/>
                </svg>
              </span>
              <span className="text-[#D5B25D] font-bold text-sm">
                {
                  {
                    ar: "احسب تكلفة مشروعك",
                    en: "Calculate Your Project Cost",
                    zh: "计算您的项目费用",
                    es: "Calcular el costo de su proyecto",
                    fr: "Calculer le coût de votre projet",
                    de: "Projektkosten berechnen",
                    tr: "Proje Maliyetinizi Hesaplayın",
                    ur: "اپنے پروجیکٹ کی لاگت کا حساب لگائیں"
                  }[lang] || "Calculate Your Project Cost"
                }
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D5B25D]/20 text-[#D5B25D]/80 font-bold tracking-wider uppercase border border-[#D5B25D]/20">
                {
                  {
                    ar: "مجاني",
                    en: "Free",
                    zh: "免费",
                    es: "Gratis",
                    fr: "Gratuit",
                    de: "Kostenlos",
                    tr: "Ücretsiz",
                    ur: "مفت"
                  }[lang] || "Free"
                }
              </span>
              <ArrowLeft size={14} className={`text-[#D5B25D]/60 transition-transform duration-300 ${lang === 'ar' || lang === 'ur' ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Mobile Layout */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between lg:hidden z-30" data-aos="fade-up">
        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-2xl sm:text-3xl font-bold text-white">15+</span>
          <span className="text-[10px] sm:text-xs text-muted uppercase tracking-widest">{t('about.experienceBadge')}</span>
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-2xl sm:text-3xl font-bold text-white">200+</span>
          <span className="text-[10px] sm:text-xs text-muted uppercase tracking-widest">
            {
              {
                ar: "مشروع ناجح",
                en: "Successful Projects",
                zh: "成功项目",
                es: "Proyectos exitosos",
                fr: "Projets réussis",
                de: "Erfolgreiche Projekte",
                tr: "Başarılı Proje",
                ur: "کامیاب منصوبے"
              }[lang] || "Successful Projects"
            }
          </span>
        </div>
      </div>

      {/* Decorative Elements - Desktop Layout */}
      <div className={`absolute bottom-10 ${lang === 'ar' || lang === 'ur' ? 'left-10' : 'right-10'} hidden lg:block z-30`} data-aos="fade-up" data-aos-delay="1000">
        <div className={`flex flex-col gap-1 ${lang === 'ar' || lang === 'ur' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">15+</span>
          <span className="text-sm text-muted uppercase tracking-widest">{t('about.experienceBadge')}</span>
        </div>
      </div>

      <div className={`absolute bottom-10 ${lang === 'ar' || lang === 'ur' ? 'right-10' : 'left-10'} hidden lg:block z-30`} data-aos="fade-up" data-aos-delay="1200">
        <div className={`flex flex-col gap-1 ${lang === 'ar' || lang === 'ur' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">200+</span>
          <span className="text-sm text-muted uppercase tracking-widest">
            {
              {
                ar: "مشروع ناجح",
                en: "Successful Projects",
                zh: "成功项目",
                es: "Proyectos exitosos",
                fr: "Projets réussis",
                de: "Erfolgreiche Projekte",
                tr: "Başarılı Proje",
                ur: "کامیاب منصوبے"
              }[lang] || "Successful Projects"
            }
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
