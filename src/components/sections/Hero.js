"use client";

import Image from "next/image";
import Button from "../ui/Button";
import TypewriterText from "@/components/TypewriterText";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-primary">
      {/* Reverted Visual Design while keeping Localization */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="MNC Construction Hero"
          fill
          className="object-cover opacity-80 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent"></div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-secondary/30 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="text-secondary text-sm font-bold tracking-widest uppercase">
              {lang === 'ar' ? 'نصنع بصمتنا في عالم البناء' : 'Making our mark in construction'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
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

          <p className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            {lang === 'ar' 
              ? "مؤسسة مروان أحمد ناظر للمقاولات العامة - خبرة عريقة في التصميم المعماري، إدارة المشاريع، والتنفيذ الإنشائي بأعلى معايير الجودة العالمية."
              : "Marwan Ahmed Nazer General Contracting - Deep expertise in architectural design, project management, and construction execution to the highest international quality standards."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-0">
            <Button size="lg" className="flex items-center justify-center gap-2 group text-sm sm:text-base">
              {lang === 'ar' ? 'استكشف مشاريعنا' : 'Explore Projects'}
              <ArrowLeft className={`transition-transform ${lang === 'ar' ? 'group-hover:translate-x-[-5px]' : 'rotate-180 group-hover:translate-x-[5px]'}`} />
            </Button>
            <Button variant="outline" size="lg" className="text-sm sm:text-base">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Mobile Layout */}
      <div className="absolute bottom-6 w-full px-6 flex justify-between lg:hidden" data-aos="fade-up">
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
      <div className={`absolute bottom-10 ${lang === 'ar' ? 'left-10' : 'right-10'} hidden lg:block`} data-aos="fade-up">
        <div className={`flex flex-col gap-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">15+</span>
          <span className="text-sm text-muted uppercase tracking-widest">{lang === 'ar' ? 'عاماً من الخبرة' : 'Years of Experience'}</span>
        </div>
      </div>

      <div className={`absolute bottom-10 ${lang === 'ar' ? 'right-10' : 'left-10'} hidden lg:block`} data-aos="fade-up">
        <div className={`flex flex-col gap-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <span className="text-4xl font-bold text-white">200+</span>
          <span className="text-sm text-muted uppercase tracking-widest">{lang === 'ar' ? 'مشروع ناجح' : 'Successful Projects'}</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
