"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Editable data ─────────────────────────────────────────────────────── */

const VALUES = [
  {
    title:  { ar: "الجودة أولاً",         en: "Quality First"           },
    desc:   { ar: "نلتزم بأعلى معايير الجودة في كل تفصيلة من تفاصيل المشروع", en: "We commit to the highest quality standards in every project detail" },
    delay: "100",
  },
  {
    title:  { ar: "الابتكار المستمر",     en: "Continuous Innovation"   },
    desc:   { ar: "نطبّق أحدث التقنيات والأساليب الهندسية في كل أعمالنا",      en: "We apply the latest engineering techniques and technologies"      },
    delay: "200",
  },
  {
    title:  { ar: "الشراكة الحقيقية",    en: "True Partnership"        },
    desc:   { ar: "نبني علاقات استراتيجية طويلة الأمد مع عملائنا وشركائنا",   en: "We build long-term strategic relationships with clients"          },
    delay: "300",
  },
  {
    title:  { ar: "الالتزام بالمواعيد",  en: "On-Time Delivery"        },
    desc:   { ar: "نسلّم مشاريعنا في الوقت المحدد دون أي تنازل عن الجودة",   en: "We deliver on schedule without compromising quality"              },
    delay: "400",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

const Vision = () => {
  const { lang, isRTL } = useLanguage();

  const tx = (obj) => obj[lang] || obj.en;

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >

      {/* ── Blueprint grid ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(213,178,93,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(213,178,93,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Ambient glows ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D5B25D]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D5B25D]/10 to-transparent" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-[#D5B25D]/[0.04] blur-[140px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#D5B25D]/[0.03] blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <div className={`mb-16 ${isRTL ? 'text-right' : 'text-left'}`} data-aos="fade-up">

          {/* Eyebrow */}
          <div className={`inline-flex items-center gap-3 mb-5 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D5B25D]" />
            <span className="text-[#D5B25D] font-bold tracking-[0.2em] uppercase text-[11px]">
              {{ ar: "رؤية وخبرة", en: "Vision & Expertise", zh: "愿景与专长",
                 es: "Visión y experiencia", fr: "Vision et expertise",
                 de: "Vision & Expertise", tr: "Vizyon & Uzmanlık", ur: "وژن اور مہارت" }[lang] || "Vision & Expertise"}
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D5B25D]" />
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4" data-aos="fade-up" data-aos-delay="100">
            <span className="text-white block">
              {{ ar: "نحن لا نبني مشاريع فقط", en: "We Don't Just Build Projects",
                 zh: "我们不只是建造项目", es: "No solo construimos proyectos",
                 fr: "Nous ne construisons pas que des projets",
                 de: "Wir bauen nicht nur Projekte",
                 tr: "Sadece proje inşa etmiyoruz", ur: "ہم صرف منصوبے نہیں بناتے" }[lang] || "We Don't Just Build Projects"}
            </span>
            <span className="text-gradient">
              {{ ar: "بل نصمم مستقبلاً متميزاً", en: "We Design a Distinguished Future",
                 zh: "我们设计卓越的未来", es: "Diseñamos un futuro distinguido",
                 fr: "Nous concevons un avenir distinctif",
                 de: "Wir gestalten eine ausgezeichnete Zukunft",
                 tr: "Seçkin bir gelecek tasarlıyoruz", ur: "ہم ایک ممتاز مستقبل ڈیزائن کرتے ہیں" }[lang] || "We Design a Distinguished Future"}
            </span>
          </h2>

          {/* Gold underline */}
          <div className={`h-1 w-16 rounded-full bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] ${isRTL ? 'mr-0' : 'ml-0'}`} data-aos="fade-up" data-aos-delay="150" />

          {/* Description */}
          <p className="mt-6 text-white/50 text-base md:text-lg leading-relaxed max-w-2xl" data-aos="fade-up" data-aos-delay="200">
            {{ ar: "شركة MNC للمقاولات تجمع بين الخبرة الراسخة والرؤية الاستشرافية لتقديم مشاريع تتجاوز التوقعات — من التصميم إلى التسليم.",
               en: "MNC Construction bridges deep expertise with forward-thinking vision to deliver projects that exceed expectations — from design to handover.",
               zh: "MNC建筑将深厚的专业知识与前瞻性愿景相结合，提供超出预期的项目。",
               fr: "MNC Construction allie expertise solide et vision prospective pour livrer des projets dépassant les attentes.",
               es: "MNC Construction combina experiencia sólida con visión prospectiva para entregar proyectos que superan las expectativas.",
               de: "MNC verbindet tiefe Expertise mit zukunftsorientierter Vision für Projekte, die Erwartungen übertreffen.",
               tr: "MNC, derin uzmanlığı ileri görüşlü bir vizyonla birleştirerek beklentilerin ötesinde projeler sunar.",
               ur: "MNC تعمیرات گہری مہارت اور دور اندیش وژن کو یکجا کرکے توقعات سے بڑھ کر منصوبے فراہم کرتی ہے۔"
            }[lang] || "MNC Construction bridges deep expertise with forward-thinking vision to deliver projects that exceed expectations."}
          </p>
        </div>

        {/* ── Vision + Mission Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {[
            {
              label: { ar: "رؤيتنا",    en: "Our Vision",   zh: "我们的愿景", fr: "Notre Vision",   es: "Nuestra Visión",   de: "Unsere Vision",  tr: "Vizyonumuz",  ur: "ہمارا وژن"  },
              text:  { ar: "أن نكون الشركة الرائدة في قطاع الإنشاءات على مستوى المنطقة، من خلال تقديم مشاريع استثنائية تجمع بين الجودة والابتكار والاستدامة.",
                       en: "To be the leading construction company in the region by delivering exceptional projects that blend quality, innovation, and sustainability." },
              num: "01",
              delay: "100",
            },
            {
              label: { ar: "رسالتنا",   en: "Our Mission",  zh: "我们的使命", fr: "Notre Mission",  es: "Nuestra Misión",  de: "Unsere Mission", tr: "Misyonumuz", ur: "ہمارا مشن" },
              text:  { ar: "تحقيق طموحات عملائنا من خلال تنفيذ مشاريع بأعلى معايير الجودة والسلامة، وبناء شراكات مبنية على الثقة والشفافية.",
                       en: "Realising our clients' ambitions through projects built to the highest standards of quality and safety, founded on trust and transparency." },
              num: "02",
              delay: "200",
            },
          ].map((card) => (
            <div
              key={card.num}
              className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-500 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B25D]/60"
              tabIndex={0}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(213,178,93,0.1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(213,178,93,0.05)";
                e.currentTarget.style.border = "1px solid rgba(213,178,93,0.25)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(213,178,93,0.08), 0 20px 60px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                e.currentTarget.style.border = "1px solid rgba(213,178,93,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              data-aos="fade-up"
              data-aos-delay={card.delay}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#D5B25D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner brackets */}
              <span aria-hidden="true"
                className={`absolute top-3 w-4 h-4 transition-colors duration-500 ${isRTL ? 'right-3' : 'left-3'}`}
                style={{ borderTop: '1px solid rgba(213,178,93,0.3)', [isRTL ? 'borderRight' : 'borderLeft']: '1px solid rgba(213,178,93,0.3)' }}
              />
              <span aria-hidden="true"
                className={`absolute bottom-3 w-4 h-4 transition-colors duration-500 ${isRTL ? 'left-3' : 'right-3'}`}
                style={{ borderBottom: '1px solid rgba(213,178,93,0.3)', [isRTL ? 'borderLeft' : 'borderRight']: '1px solid rgba(213,178,93,0.3)' }}
              />

              {/* Number watermark */}
              <span className={`absolute top-4 ${isRTL ? 'left-5' : 'right-5'} text-6xl font-black text-white/[0.03] group-hover:text-[#D5B25D]/[0.07] transition-colors duration-500 select-none leading-none`}>
                {card.num}
              </span>

              {/* Gold pill label */}
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
                style={{ background: "rgba(213,178,93,0.1)", border: "1px solid rgba(213,178,93,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5B25D]" />
                <span className="text-[#D5B25D] text-[11px] font-bold tracking-widest uppercase">
                  {tx(card.label)}
                </span>
              </div>

              <p className="text-white/55 text-sm md:text-base leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                {tx(card.text)}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D5B25D]/0 to-transparent group-hover:via-[#D5B25D]/20 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* ── Values 2×2 Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map((val, i) => (
            <div
              key={i}
              className="group flex items-start gap-4 rounded-xl p-5 transition-all duration-400 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5B25D]/60"
              tabIndex={0}
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(213,178,93,0.07)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(213,178,93,0.04)";
                e.currentTarget.style.border = "1px solid rgba(213,178,93,0.18)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                e.currentTarget.style.border = "1px solid rgba(213,178,93,0.07)";
              }}
              data-aos="fade-up"
              data-aos-delay={val.delay}
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: "rgba(213,178,93,0.1)", border: "1px solid rgba(213,178,93,0.2)" }}>
                <CheckCircle2 size={16} className="text-[#D5B25D]" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-white font-bold text-sm md:text-base leading-snug group-hover:text-[#D5B25D] transition-colors duration-300">
                  {tx(val.title)}
                </h4>
                <p className="text-white/40 text-xs md:text-sm leading-relaxed group-hover:text-white/55 transition-colors duration-300">
                  {tx(val.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Vision;
