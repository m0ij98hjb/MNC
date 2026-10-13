"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Lightbulb, Users, Clock } from "lucide-react";

const WhyChooseUs = () => {
  const { t, lang, isRTL } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t('features.precision.title'),
      desc: t('features.precision.desc'),
      delay: "100",
      num: "01",
    },
    {
      icon: Lightbulb,
      title: t('features.innovation.title'),
      desc: t('features.innovation.desc'),
      delay: "200",
      num: "02",
    },
    {
      icon: Users,
      title: t('features.management.title'),
      desc: t('features.management.desc'),
      delay: "300",
      num: "03",
    },
    {
      icon: Clock,
      title: t('features.deadlines.title'),
      desc: t('features.deadlines.desc'),
      delay: "400",
      num: "04",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[var(--background)] relative overflow-hidden">

      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2a624]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2a624]/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#f2a624]" />
            <span className="text-[#f2a624] font-bold tracking-[0.2em] uppercase text-[11px]">
              {{
                ar: "مميزاتنا", en: "Our Strengths", zh: "我们的优势",
                es: "Nuestras fortalezas", fr: "Nos atouts", de: "Unsere Stärken",
                tr: "Güçlü Yönlerimiz", ur: "ہماری خصوصیات",
                hi: "हमारी ताकत", ru: "Наши преимущества",
              }[lang] || "Our Strengths"}
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#f2a624]" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            {{
              ar: <>لماذا تختار <span className="text-[#f2a624]">MNC</span>؟</>,
              en: <>Why Choose <span className="text-[#f2a624]">MNC</span>?</>,
              zh: <>为什么选择 <span className="text-[#f2a624]">MNC</span>？</>,
              es: <>¿Por qué elegir <span className="text-[#f2a624]">MNC</span>?</>,
              fr: <>Pourquoi choisir <span className="text-[#f2a624]">MNC</span> ?</>,
              de: <>Warum <span className="text-[#f2a624]">MNC</span> wählen?</>,
              tr: <>Neden <span className="text-[#f2a624]">MNC</span>?</>,
              ur: <>کیوں منتخب کریں <span className="text-[#f2a624]">MNC</span>؟</>,
              hi: <>क्यों चुनें <span className="text-[#f2a624]">MNC</span>?</>,
              ru: <>Почему выбирают <span className="text-[#f2a624]">MNC</span>?</>,
            }[lang] || <>Why Choose <span className="text-[#f2a624]">MNC</span>?</>}
          </h2>

          <p className="text-white/45 text-base leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl p-6 flex flex-col gap-5 overflow-hidden cursor-default bg-[var(--card-bg)] border border-slate-200 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#f2a624]"
                data-aos="fade-up"
                data-aos-delay={feature.delay}
              >
                {/* Orange top bar that grows in on hover */}
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[3px] bg-[#f2a624] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />

                {/* Number watermark */}
                <span aria-hidden="true" className={`absolute top-4 ${isRTL ? 'left-5' : 'right-5'} text-5xl font-black text-slate-100 group-hover:text-[#f2a624]/20 transition-colors duration-300 select-none leading-none`}>
                  {feature.num}
                </span>

                {/* Icon tile: tinted, fills with the brand orange on hover */}
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#f2a624]/10 text-[var(--brand,#f2a624)] transition-colors duration-300 group-hover:bg-[#f2a624] group-hover:text-[#0f172a]">
                  <Icon size={22} aria-hidden="true" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[var(--primary)] font-bold text-base leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
