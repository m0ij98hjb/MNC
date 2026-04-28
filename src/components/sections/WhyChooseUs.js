"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Lightbulb, Users, Clock } from "lucide-react";

const WhyChooseUs = () => {
  const { t, lang } = useLanguage();

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
              {lang === 'ar' ? 'مميزاتنا' : 'Our Strengths'}
            </span>
            <span className="h-px w-8 bg-secondary"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-6 leading-tight">
            {lang === 'ar' ? (
              <>لماذا تختار <span className="text-secondary">MNC</span>؟</>
            ) : (
              <>Why Choose <span className="text-secondary">MNC</span>?</>
            )}
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              {/* Number watermark */}
              <span className={`absolute top-3 ${lang === 'ar' ? 'left-4' : 'right-4'} text-5xl font-black text-slate-100 group-hover:text-secondary/10 transition-colors duration-500 select-none`}>
                {feature.num}
              </span>

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-5 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rounded-2xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-slate-500 leading-relaxed text-sm font-medium">
                {feature.desc}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-secondary group-hover:w-1/2 transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
