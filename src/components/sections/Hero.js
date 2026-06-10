"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Button from "../ui/Button";
import TypewriterText from "@/components/TypewriterText";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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
        <div className="max-w-4xl" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30 mb-8" data-aos="fade-down" data-aos-delay="200">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-secondary text-sm font-bold tracking-widest uppercase">
              {lang === 'ar' ? 'نصنع بصمتنا في عالم البناء' : 'Making our mark in construction'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-aos="fade-up" data-aos-delay="400" style={{ textShadow: "0 4px 16px rgba(0,0,0,0.7)" }}>
            <TypewriterText
              texts={lang === 'ar' ? ["بصمة هندسية", "متميزة"] : ["Distinctive", "Engineering Mark"]}
              typingSpeed={120}
              deletingSpeed={60}
              pauseDuration={2000}
              loop={true}
              className="text-white"
              textClassNames={["", "text-secondary"]}
            />
          </h1>

          <p className="text-base md:text-xl text-slate-100 font-semibold mb-10 max-w-2xl leading-relaxed" data-aos="fade-up" data-aos-delay="600" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
            {lang === 'ar'
              ? "مؤسسة مروان أحمد ناظر للمقاولات العامة - خبرة عريقة في التصميم المعماري، إدارة المشاريع، والتنفيذ الإنشائي بأعلى معايير الجودة العالمية."
              : "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-0" data-aos="fade-up" data-aos-delay="800">
            <Button as={Link} href="/projects" size="lg" className="flex items-center justify-center gap-2 group text-sm sm:text-base">
              {lang === 'ar' ? 'استكشف مشاريعنا' : 'Explore Projects'}
              <ArrowLeft className={`transition-transform ${lang === 'ar' ? 'group-hover:translate-x-[-5px]' : 'rotate-180 group-hover:translate-x-[5px]'}`} />
            </Button>
            <Button as={Link} href="/us" variant="outline" size="lg" className="text-sm sm:text-base">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Mobile Layout */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between lg:hidden z-30" data-aos="fade-up">
        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-2xl sm:text-3xl font-bold text-white">15+</span>
          <span className="text-[10px] sm:text-xs text-muted uppercase tracking-widest">{lang === 'ar' ? 'عاماً من الخبرة' : 'Years of Experience'}</span>
        </div>

        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-2xl sm:text-3xl font-bold text-white">200+</span>
          <span className="text-[10px] sm:text-xs text-muted uppercase tracking-widest">{lang === 'ar' ? 'مشروع ناجح' : 'Successful Projects'}</span>
        </div>
      </div>

      {/* Decorative Elements - Desktop Layout */}
      <div className={`absolute bottom-10 ${lang === 'ar' ? 'left-10' : 'right-10'} hidden lg:block z-30`} data-aos="fade-up" data-aos-delay="1000">
        <div className={`flex flex-col gap-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">15+</span>
          <span className="text-sm text-muted uppercase tracking-widest">{lang === 'ar' ? 'عاماً من الخبرة' : 'Years of Experience'}</span>
        </div>
      </div>

      <div className={`absolute bottom-10 ${lang === 'ar' ? 'right-10' : 'left-10'} hidden lg:block z-30`} data-aos="fade-up" data-aos-delay="1200">
        <div className={`flex flex-col gap-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">200+</span>
          <span className="text-sm text-muted uppercase tracking-widest">{lang === 'ar' ? 'مشروع ناجح' : 'Successful Projects'}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
