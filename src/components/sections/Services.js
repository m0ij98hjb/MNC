"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { FaHardHat, FaDraftingCompass, FaProjectDiagram, FaCouch } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const Services = () => {
  const { lang, t } = useLanguage();

  const services = [
    {
      title: lang === 'ar' ? "مشاريع المقاولات" : "Construction Projects",
      description: lang === 'ar' 
        ? "تنفيذ كافة أعمال الإنشاءات والمباني السكنية والتجارية بأعلى دقة ومعايير السلامة العالمية."
        : "Execution of all construction, residential and commercial building works with the highest precision and international safety standards.",
      icon: <FaHardHat size={38} />,
      delay: "100",
    },
    {
      title: lang === 'ar' ? "التصميم المعماري" : "Architectural Design",
      description: lang === 'ar'
        ? "نبتكر حلولاً تصميمية فريدة تجمع بين الجمالية والوظيفة العملية، محولين المساحات إلى تحف فنية."
        : "We create unique design solutions that combine aesthetics and practical function, turning spaces into artistic masterpieces.",
      icon: <FaDraftingCompass size={38} />,
      delay: "200",
    },
    {
      title: lang === 'ar' ? "إدارة المشاريع" : "Project Management",
      description: lang === 'ar'
        ? "إشراف هندسي متكامل ومتابعة دقيقة لكل مراحل العمل لضمان الجودة الصارمة والجدول الزمني."
        : "Integrated engineering supervision and close follow-up of all work phases to ensure strict quality and scheduling.",
      icon: <FaProjectDiagram size={38} />,
      delay: "300",
    },
    {
      title: lang === 'ar' ? "التصميم الداخلي" : "Interior Design",
      description: lang === 'ar'
        ? "لمسات إبداعية في الديكور والتنسيق الداخلي تضفي الفخامة والراحة وتناسب ذوقك الرفيع."
        : "Creative touches in decoration and interior coordination that add luxury and comfort, suiting your high taste.",
      icon: <FaCouch size={38} />,
      delay: "400",
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/architectural-layout.png')]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-secondary"></span>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs">
              {lang === 'ar' ? 'خدماتنا الهندسية' : 'Our Engineering Services'}
            </span>
            <span className="h-px w-8 bg-secondary"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-primary leading-tight" data-aos="fade-up" data-aos-delay="100">
            {lang === 'ar' ? (
              <>حلول هندسية <span className="text-secondary">متكاملة</span> <br /> بمعايير عالمية</>
            ) : (
              <>Integrated <span className="text-secondary">Engineering</span> <br /> Solutions</>
            )}
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            {lang === 'ar'
              ? "نغطي كافة جوانب العمل الهندسي والإنشائي، من الفكرة والتصميم وحتى تسليم المفتاح، مع التركيز التام على أدق التفاصيل لضمان تميز مشروعك."
              : "We cover all aspects of engineering and construction work, from concept and design to turnkey delivery, with total focus on the finest details to ensure your project's excellence."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.12)] transition-all duration-500 border border-slate-100 relative overflow-hidden flex flex-col items-center text-center hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={service.delay}
            >
              {/* Permanent Top Border */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary/80"></div>
              
              {/* Icon Container */}
              <div className="w-24 h-24 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-secondary group-hover:rotate-[10deg] transition-all duration-500 shadow-sm">
                <div className="text-secondary group-hover:text-white transition-colors duration-500">
                  {service.icon}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-black mb-3 text-primary group-hover:text-secondary transition-colors duration-500">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                {service.description}
              </p>

              {/* Permanent Learn More Link */}
              <div className="mt-auto pt-4 flex items-center gap-2 text-secondary text-xs font-black uppercase tracking-widest transition-all duration-500 cursor-pointer hover:gap-3">
                {lang === 'ar' ? 'اكتشف المزيد' : 'Learn More'}
                {lang === 'ar' ? <ArrowRight size={14} className="rotate-180" /> : <ArrowRight size={14} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
