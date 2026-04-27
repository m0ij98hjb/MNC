"use client";

import { Building2, Ruler, BarChart3, Palette, ArrowRight } from "lucide-react";

const services = [
  {
    title: "مشاريع المقاولات",
    description: "تنفيذ كافة أعمال الإنشاءات والمباني السكنية والتجارية بأعلى دقة ومعايير السلامة العالمية.",
    icon: Building2,
    delay: "100",
  },
  {
    title: "التصميم المعماري",
    description: "نبتكر حلولاً تصميمية فريدة تجمع بين الجمالية والوظيفة العملية، محولين المساحات إلى تحف فنية.",
    icon: Ruler,
    delay: "200",
  },
  {
    title: "إدارة المشاريع",
    description: "إشراف هندسي متكامل ومتابعة دقيقة لكل مراحل العمل لضمان الجودة الصارمة والجدول الزمني.",
    icon: BarChart3,
    delay: "300",
  },
  {
    title: "التصميم الداخلي",
    description: "لمسات إبداعية في الديكور والتنسيق الداخلي تضفي الفخامة والراحة وتناسب ذوقك الرفيع.",
    icon: Palette,
    delay: "400",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/architectural-layout.png')]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-secondary"></span>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs">خدماتنا الهندسية</span>
            <span className="h-px w-8 bg-secondary"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-primary leading-tight">
            حلول هندسية <span className="text-secondary">متكاملة</span> <br />
            بمعايير عالمية
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            نغطي كافة جوانب العمل الهندسي والإنشائي، من الفكرة والتصميم وحتى تسليم المفتاح، مع التركيز التام على أدق التفاصيل لضمان تميز مشروعك.
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
              
              {/* Icon Container - Permanent Color */}
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-secondary group-hover:rotate-[10deg] transition-all duration-500 shadow-sm">
                <service.icon className="text-secondary group-hover:text-white transition-colors duration-500" size={36} strokeWidth={1.5} />
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
                اكتشف المزيد
                <ArrowRight size={14} className="rtl:rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
