"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Lightbulb, Users, Clock } from "lucide-react";

const WhyChooseUs = () => {
  const { t, lang, isRTL } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck size={28} />,
      title: t('features.precision.title'),
      desc: t('features.precision.desc'),
      delay: "100",
      num: "01",
    },
    {
      icon: <Lightbulb size={28} />,
      title: t('features.innovation.title'),
      desc: t('features.innovation.desc'),
      delay: "200",
      num: "02",
    },
    {
      icon: <Users size={28} />,
      title: t('features.management.title'),
      desc: t('features.management.desc'),
      delay: "300",
      num: "03",
    },
    {
      icon: <Clock size={28} />,
      title: t('features.deadlines.title'),
      desc: t('features.deadlines.desc'),
      delay: "400",
      num: "04",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/[0.03] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="h-px w-8 bg-secondary"></span>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs">
              {
                {
                  ar: "مميزاتنا",
                  en: "Our Strengths",
                  zh: "我们的优势",
                  es: "Nuestras fortalezas",
                  fr: "Nos atouts",
                  de: "Unsere Stärken",
                  tr: "Güçlü Yönlerimiz",
                  ur: "ہماری خصوصیات"
                }[lang] || "Our Strengths"
              }
            </span>
            <span className="h-px w-8 bg-secondary"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-6 leading-tight">
            {
              {
                ar: <>لماذا تختار <span className="text-secondary">MNC</span>؟</>,
                en: <>Why Choose <span className="text-secondary">MNC</span>?</>,
                zh: <>为什么选择 <span className="text-secondary">MNC</span>？</>,
                es: <>¿Por qué elegir <span className="text-secondary">MNC</span>?</>,
                fr: <>Pourquoi choisir <span className="text-secondary">MNC</span> ?</>,
                de: <>Warum <span className="text-secondary">MNC</span> wählen?</>,
                tr: <>Neden <span className="text-secondary">MNC</span>?</>,
                ur: <>کیوں منتخب کریں <span className="text-secondary">MNC</span>؟</>
              }[lang] || <>Why Choose <span className="text-secondary">MNC</span>?</>
            }
          </h2>
          <p className="text-[var(--foreground)] text-lg font-medium">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition-all duration-500 group -translate-y-1 hover:translate-y-0 flex flex-col justify-center items-center text-center overflow-hidden aspect-square w-full max-w-[250px] mx-auto"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 rounded-2xl"></div>

              {/* Number watermark */}
              <span className={`absolute top-3 ${isRTL ? 'left-4' : 'right-4'} text-4xl font-black text-secondary/10 group-hover:text-slate-100 transition-colors duration-500 select-none`}>
                {feature.num}
              </span>

              {/* Icon */}
              <div className="relative z-10 w-12 h-12 bg-secondary text-white rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-secondary/10 group-hover:text-secondary group-hover:rounded-xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-lg font-bold text-secondary mb-2 group-hover:text-[#0f172a] transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-[#334155] leading-relaxed text-sm font-medium">
                {feature.desc}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-secondary group-hover:w-0 transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
