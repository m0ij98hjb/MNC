"use client";

import Image from "next/image";
import { CheckCircle2, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const About = () => {
  const { lang, t } = useLanguage();

  const highlights = lang === 'ar' 
    ? ["تصميمات معمارية مبتكرة", "إدارة مشاريع احترافية", "تنفيذ بأعلى جودة", "التزام تام بالمواعيد"]
    : ["Innovative Architectural Designs", "Professional Project Management", "Highest Quality Execution", "Full Commitment to Deadlines"];

  return (
    <section id="about" className="py-20 bg-white relative overflow-x-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1/3 h-full bg-slate-50/50 ${lang === 'ar' ? '-skew-x-12 translate-x-1/2' : 'skew-x-12 -translate-x-1/2'} -z-10 hidden sm:block`}></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className={`flex flex-col ${lang === 'ar' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative" data-aos="fade-up">
            <div className="relative z-10 group">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <Image
                  src="/asstes/director_ar.png"
                  alt={lang === 'ar' ? "المهندس مروان أحمد ناظر" : "Eng. Marwan Ahmed Nazer"}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Badge */}
              <div className={`absolute -bottom-4 ${lang === 'ar' ? '-right-2' : '-left-2'} md:-bottom-6 ${lang === 'ar' ? 'md:-right-6 lg:-right-10' : 'md:-left-6 lg:-left-10'} bg-white p-4 md:p-6 rounded-2xl shadow-2xl border border-slate-100 z-20`} data-aos="zoom-in" data-aos-delay="400">
                <div className="flex flex-col">
                  <span className="text-secondary font-black text-xl md:text-2xl leading-none">15+</span>
                  <span className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-tighter font-bold mt-1">
                    {lang === 'ar' ? 'عاماً من الخبرة' : 'Years of Experience'}
                  </span>
                </div>
              </div>

              {/* Decorative Frame */}
              <div className={`absolute -top-4 ${lang === 'ar' ? '-left-2 md:-top-6 md:-left-6' : '-right-2 md:-top-6 md:-right-6'} w-20 h-20 md:w-32 md:h-32 ${lang === 'ar' ? 'border-t-4 border-l-4 rounded-tl-3xl' : 'border-t-4 border-r-4 rounded-tr-3xl'} border-secondary/30 -z-10`}></div>
            </div>

            {/* Director Title Card */}
            <div className={`absolute -bottom-10 ${lang === 'ar' ? 'left-2 md:left-6 lg:-left-10' : 'right-2 md:right-6 lg:-right-10'} bg-white backdrop-blur-md p-4 md:p-5 rounded-xl border border-white/10 shadow-2xl z-20`} data-aos="fade-up" data-aos-delay="500">
              <h4 className="text-secondary font-bold text-base md:text-lg mb-0.5">
                {lang === 'ar' ? 'م. مروان أحمد ناظر' : 'Eng. Marwan Ahmed Nazer'}
              </h4>
              <p className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest font-bold">
                {lang === 'ar' ? 'المدير التنفيذي لشركة MNC' : 'CEO of MNC Company'}
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2" data-aos="fade-up">
            <div className={`mb-10 text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className={`flex items-center gap-3 mb-4 justify-center ${lang === 'ar' ? 'lg:justify-start' : 'lg:justify-start'}`} data-aos="fade-up" data-aos-delay="100">
                <span className="h-px w-8 bg-secondary"></span>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">
                  {lang === 'ar' ? 'رؤية وخبرة' : 'Vision & Expertise'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-primary leading-[1.2]" data-aos="fade-up" data-aos-delay="200">
                {lang === 'ar' ? (
                  <>نحن لا نبني جدراناً، <br /> <span className="text-secondary">بل نُصمم مستقبلاً متميزاً</span></>
                ) : (
                  <>We don't just build walls, <br /> <span className="text-secondary">We design an excellent future</span></>
                )}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-8 font-medium" data-aos="fade-up" data-aos-delay="300">
                {lang === 'ar'
                  ? "تعتبر مؤسسة مروان أحمد ناظر للمقاولات العامة من المؤسسات الرائدة في المملكة، حيث نجمع بين الأصالة الهندسية والرؤية العصرية. نلتزم بتحويل المخططات الصماء إلى بصمات معمارية تنبض بالحياة والجودة."
                  : "Marwan Ahmed Nazer General Contracting is one of the leading institutions in the Kingdom, where we combine engineering authenticity with modern vision. We are committed to turning mute plans into architectural marks that pulse with life and quality."}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12" data-aos="fade-up" data-aos-delay="400">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center transition-colors group-hover:bg-secondary">
                    <CheckCircle2 className="text-secondary group-hover:text-white transition-colors" size={14} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Quote Section */}
            <div className={`relative p-8 bg-slate-50 rounded-2xl ${lang === 'ar' ? 'border-r-4' : 'border-l-4'} border-secondary group hover:shadow-xl transition-all duration-500`} data-aos="fade-up" data-aos-delay="500">
              <Quote className={`absolute -top-4 ${lang === 'ar' ? 'left-6' : 'right-6'} text-secondary/20 group-hover:text-secondary/40 transition-colors`} size={48} />
              <p className="italic text-slate-700 leading-relaxed font-semibold relative z-10">
                {lang === 'ar'
                  ? '"مهمتنا هي تقديم تميز هندسي يفوق التوقعات، مع التركيز على الاستدامة والابتكار في كل تفصيلة إنشائية."'
                  : '"Our mission is to provide engineering excellence that exceeds expectations, with a focus on sustainability and innovation in every construction detail."'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
