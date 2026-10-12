"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cldOptimize } from "@/lib/cloudinary";

const About = () => {
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar' || lang === 'ur';
  const { data: aboutCms, loading: aboutLoading } = useSiteContent('about');

  // While the CMS doc is still loading, don't render either the stale
  // hardcoded fallback or a wrong image — render null and show a skeleton
  // instead, so refreshing the page never flashes the old photo before the
  // real one (from Firestore/Cloudinary) swaps in.
  const directorImage = aboutLoading ? null : (aboutCms?.director_image || '/asstes/directort-company.jpg');
  const directorName  = aboutCms?.director_name  || t('about.directorName');
  const directorTitle = isRTL
    ? (aboutCms?.director_pos_ar || t('about.directorTitle'))
    : (aboutCms?.director_pos_en || t('about.directorTitle'));

  const ceoImage = aboutLoading ? null : (aboutCms?.ceo_image || '/asstes/directorr-Company%20manager.jpeg');
  const ceoName  = aboutCms?.ceo_name  || t('about.ceoName');
  const ceoTitle = (isRTL ? aboutCms?.ceo_pos_ar : aboutCms?.ceo_pos_en) || t('about.ceoTitle');

  const leaders = [
    { key: 'director', image: directorImage, name: directorName, title: directorTitle, objectPosition: 'center 2%' },
    { key: 'ceo',      image: ceoImage,      name: ceoName,      title: ceoTitle,      objectPosition: 'center top' },
  ];

  const stats = [
    { value: '1986', label: { ar: 'سنة التأسيس', en: 'Founded', zh: '成立年份', es: 'Fundada', fr: 'Fondée',
                              de: 'Gegründet', tr: 'Kuruluş', ur: 'سالِ قیام', hi: 'स्थापना', ru: 'Основана' } },
    { value: '+30', label: { ar: 'عامًا من الخبرة', en: 'Years of experience', zh: '年经验', es: 'Años de experiencia',
                             fr: "Ans d'expérience", de: 'Jahre Erfahrung', tr: 'Yıllık deneyim', ur: 'سال کا تجربہ',
                             hi: 'वर्षों का अनुभव', ru: 'Лет опыта' } },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-(--card-bg) relative overflow-x-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Content column (faces the portraits) ── */}
          <div className="lg:col-span-6 lg:self-center text-start" data-aos="fade-up">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#D5B25D]" />
              <span className="text-[#D5B25D] font-bold tracking-[0.2em] uppercase text-[11px]">
              {{ ar: "قيادة وخبرة", en: "Leadership & Expertise", zh: "领导力与专长",
                 es: "Liderazgo y experiencia", fr: "Leadership et expertise",
                 de: "Führung & Expertise", tr: "Liderlik & Uzmanlık", ur: "قیادت اور مہارت",
                 hi: "नेतृत्व और विशेषज्ञता", ru: "Лидерство и опыт" }[lang] || "Leadership & Expertise"}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-black leading-[1.2] mb-5">
              <span className="text-gradient">
              {{ ar: "القيادة التي تبني الثقة", en: "The Leadership That Builds Trust",
                 zh: "建立信任的领导力", es: "El liderazgo que construye confianza",
                 fr: "Le leadership qui construit la confiance",
                 de: "Die Führung, die Vertrauen aufbaut",
                 tr: "Güven İnşa Eden Liderlik", ur: "وہ قیادت جو اعتماد بناتی ہے",
                 hi: "विश्वास बनाने वाला नेतृत्व", ru: "Лидерство, создающее доверие" }[lang] || "The Leadership That Builds Trust"}
              </span>
            </h2>

            <div className="h-1 w-16 rounded-full bg-linear-to-r from-secondary to-gold" />

            {/* Description */}
            <p className="mt-6 text-white/70 text-base md:text-lg leading-loose max-w-xl">
            {{ ar: "نؤمن بأن الهندسة رسالة قبل أن تكون مهنة، وخلف كل مشروع ناجح قيادة راسخة منذ عام 1986 — بخبرة تمتد لأكثر من ثلاثة عقود تحوّل الرؤية إلى واقع وتصنع الفارق في كل تفصيلة.",
               en: "We believe engineering is a calling before a profession — behind every successful project stands leadership rooted since 1986, with over three decades of experience turning vision into reality.",
               zh: "我们相信工程是一种使命——自1986年以来，每个成功项目背后都有深厚的领导力，三十余年经验将愿景变为现实。",
               fr: "Nous croyons que l'ingénierie est une vocation — derrière chaque projet réussi se trouve un leadership ancré depuis 1986, fort de plus de trois décennies d'expérience.",
               es: "Creemos que la ingeniería es una vocación — detrás de cada proyecto exitoso hay un liderazgo consolidado desde 1986, con más de tres décadas de experiencia.",
               de: "Wir glauben, dass Ingenieurwesen eine Berufung ist — hinter jedem erfolgreichen Projekt steht eine seit 1986 verwurzelte Führung mit über drei Jahrzehnten Erfahrung.",
               tr: "Mühendisliğin bir meslek olmadan önce bir misyon olduğuna inanıyoruz — her başarılı projenin arkasında 1986'dan bu yana köklü, otuz yılı aşkın deneyime sahip bir liderlik vardır.",
               ur: "ہمارا ماننا ہے کہ انجینئرنگ ایک پیشے سے پہلے ایک مشن ہے — ہر کامیاب منصوبے کے پیچھے 1986 سے قائم قیادت ہے جو تین دہائیوں سے زائد تجربے کے ساتھ وژن کو حقیقت میں بدلتی ہے۔",
               hi: "हम मानते हैं कि इंजीनियरिंग एक पेशे से पहले एक मिशन है — हर सफल परियोजना के पीछे 1986 से स्थापित नेतृत्व है, जिसके पास तीन दशकों से अधिक का अनुभव है।",
               ru: "Мы верим, что инженерия — это призвание. За каждым успешным проектом стоит руководство, заложенное с 1986 года, с более чем тридцатилетним опытом."
            }[lang] || "We believe engineering is a calling before a profession — behind every successful project stands leadership rooted since 1986, with over three decades of experience."}
            </p>

            {/* Key figures */}
            <div className="mt-10 grid grid-cols-2 max-w-md border-y border-white/10">
              {stats.map((s, i) => (
                <div key={s.value} className={`py-6 ${i === 0 ? 'pe-6 border-e border-white/10' : 'ps-6'}`}>
                  <div className="text-gradient text-4xl md:text-5xl font-black leading-none tracking-tight">{s.value}</div>
                  <div className="mt-2 text-white/55 text-sm font-semibold">{s.label[lang] || s.label.en}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Portraits column: two leader cards, stacked ── */}
          <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
            {leaders.map((leader, i) => (
              <article
                key={leader.key}
                className={`group flex items-center gap-5 sm:gap-7 p-3 sm:p-4 rounded-3xl bg-white/[0.03] border border-white/10 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] transition-transform duration-500 hover:-translate-y-1 ${i === 1 ? 'lg:ms-12' : 'lg:me-12'}`}
                data-aos="fade-up"
                data-aos-delay={150 + i * 150}
              >
                {/* Portrait */}
                <div className="relative shrink-0 w-[120px] sm:w-[160px] md:w-[180px] aspect-[1019/1600] rounded-2xl overflow-hidden bg-white">
                  {leader.image ? (
                    <Image
                      src={cldOptimize(leader.image)}
                      alt={leader.name}
                      fill
                      sizes="180px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectPosition: leader.objectPosition }}
                      unoptimized={leader.image.startsWith('http')}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-secondary to-gold" />
                </div>

                {/* Details opposite the portrait */}
                <div className="min-w-0 flex-1 text-start pe-2">
                  <span className="text-[#D5B25D] text-[11px] font-bold tracking-[0.18em] tabular-nums">0{i + 1}</span>
                  <h3 className="mt-2 text-white text-lg sm:text-xl md:text-2xl font-black leading-snug">{leader.name}</h3>
                  <span className="block h-px w-10 bg-[#D5B25D]/60 my-3 sm:my-4" />
                  <p className="text-white/60 text-sm md:text-[15px] font-semibold leading-relaxed">{leader.title}</p>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
