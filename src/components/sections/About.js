"use client";

import Image from "next/image";
import { CheckCircle2, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const About = () => {
  const { lang, t } = useLanguage();

  const highlights = t('about.highlights') || [];

  return (
    <section id="about" className="py-20 bg-[var(--card-bg)] relative overflow-x-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 ${lang === 'ar' || lang === 'ur' ? 'right-0' : 'left-0'} w-1/3 h-full bg-slate-50/50 ${lang === 'ar' || lang === 'ur' ? '-skew-x-12 translate-x-1/2' : 'skew-x-12 -translate-x-1/2'} -z-10 hidden sm:block`}></div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`flex flex-col ${lang === 'ar' || lang === 'ur' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>

          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative" data-aos="fade-up">
            <div className="relative z-10 group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <Image
                  src="/asstes/director.png"
                  alt={t('about.directorName')}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 2%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Badge */}
              <div className={`absolute -bottom-4 ${lang === 'ar' || lang === 'ur' ? '-right-2' : '-left-2'} md:-bottom-6 ${lang === 'ar' || lang === 'ur' ? 'md:-right-6 lg:-right-10' : 'md:-left-6 lg:-left-10'} bg-white p-4 md:p-6 rounded-2xl shadow-2xl border border-[rgba(15,23,42,0.06)] z-20`} data-aos="zoom-in" data-aos-delay="400">
                <div className="flex flex-col">
                  <span className="text-secondary font-black text-xl md:text-2xl leading-none">15+</span>
                  <span className="text-black text-[8px] md:text-[10px] uppercase tracking-tighter font-bold mt-1">
                    {t('about.experienceBadge')}
                  </span>
                </div>
              </div>

              {/* Decorative Frame */}
              <div className={`absolute -top-4 ${lang === 'ar' || lang === 'ur' ? '-left-2 md:-top-6 md:-left-6' : '-right-2 md:-top-6 md:-right-6'} w-20 h-20 md:w-32 md:h-32 ${lang === 'ar' || lang === 'ur' ? 'border-t-4 border-l-4 rounded-tl-3xl' : 'border-t-4 border-r-4 rounded-tr-3xl'} border-secondary -z-10`}></div>
            </div>

            {/* Director Title Card */}
            <div className={`absolute -bottom-10 ${lang === 'ar' || lang === 'ur' ? 'left-2 md:left-6 lg:-left-10' : 'right-2 md:right-6 lg:-right-10'} bg-white  backdrop-blur-md p-4 md:p-5 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-2xl z-20`} data-aos="fade-up" data-aos-delay="500">
              <h4 className="text-secondary font-bold text-base md:text-lg mb-0.5">
                {t('about.directorName')}
              </h4>
              <p className="text-black text-[8px] md:text-[10px] uppercase tracking-widest font-bold">
                {t('about.directorTitle')}
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2" data-aos="fade-up">
            <div className={`mb-10 text-center ${lang === 'ar' || lang === 'ur' ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className={`flex items-center gap-3 mb-4 justify-center ${lang === 'ar' || lang === 'ur' ? 'lg:justify-start' : 'lg:justify-start'}`} data-aos="fade-up" data-aos-delay="100">
                <span className="h-px w-8 bg-secondary"></span>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">
                  {t('about.badge')}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-[var(--foreground)] leading-[1.2]" data-aos="fade-up" data-aos-delay="200">
                {t('about.titlePart1')} <br /> <span className="text-secondary">{t('about.titlePart2')}</span>
              </h2>
              <p className="text-[var(--foreground)] leading-relaxed text-base md:text-lg mb-8 font-medium" data-aos="fade-up" data-aos-delay="300">
                {t('about.description')}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12" data-aos="fade-up" data-aos-delay="400">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center transition-colors group-hover:bg-secondary">
                    <CheckCircle2 className="text-secondary group-hover:text-white transition-colors" size={14} />
                  </div>
                  <span className="font-bold text-[var(--foreground)] text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Quote Section */}
            <div className={`relative p-8 bg-slate-50 rounded-2xl ${lang === 'ar' || lang === 'ur' ? 'border-r-4' : 'border-l-4'} border-secondary group hover:shadow-xl transition-all duration-500`} data-aos="fade-up" data-aos-delay="500">
              <Quote className={`absolute -top-4 ${lang === 'ar' || lang === 'ur' ? 'left-6' : 'right-6'} text-secondary/20 group-hover:text-secondary/40 transition-colors`} size={48} />
              <p className="italic text-black leading-relaxed font-semibold relative z-10">
                {t('about.quote')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
