"use client";

import Image from "next/image";
import { CheckCircle2, Quote } from "lucide-react";

const About = () => {
  const highlights = [
    "تصميمات معمارية مبتكرة",
    "إدارة مشاريع احترافية",
    "تنفيذ بأعلى جودة",
    "التزام تام بالمواعيد",
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 -z-10"></div>
      
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side - Refined */}
          <div className="lg:w-1/2 relative" data-aos="fade-left">
            <div className="relative z-10 group">
              {/* Main Image Wrapper */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <Image
                  src="/asstes/director_ar.png"
                  alt="المهندس مروان أحمد ناظر"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 z-20" data-aos="zoom-in" data-aos-delay="400">
                <div className="flex flex-col">
                  <span className="text-secondary font-black text-2xl leading-none">15+</span>
                  <span className="text-slate-500 text-[10px] uppercase tracking-tighter font-bold mt-1">عاماً من الخبرة</span>
                </div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-secondary/30 rounded-tl-3xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-secondary/20 rounded-2xl -z-10 translate-x-4 translate-y-4"></div>
            </div>

            {/* Director Title Card */}
            <div className="absolute -bottom-2 left-6 lg:-left-10 bg-primary/95 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl z-20" data-aos="fade-up" data-aos-delay="500">
              <h4 className="text-secondary font-bold text-lg mb-0.5">م. مروان أحمد ناظر</h4>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">المدير التنفيذي لشركة MNC</p>
            </div>
          </div>

          {/* Content Side - More Professional */}
          <div className="lg:w-1/2" data-aos="fade-right">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-secondary"></span>
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">رؤية وخبرة</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-primary leading-[1.2]">
                نحن لا نبني جدراناً، <br />
                <span className="text-secondary">بل نُصمم مستقبلاً متميزاً</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-8 font-medium">
                تعتبر مؤسسة مروان أحمد ناظر للمقاولات العامة من المؤسسات الرائدة في المملكة، حيث نجمع بين الأصالة الهندسية والرؤية العصرية. نلتزم بتحويل المخططات الصماء إلى بصمات معمارية تنبض بالحياة والجودة.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center transition-colors group-hover:bg-secondary">
                    <CheckCircle2 className="text-secondary group-hover:text-white transition-colors" size={14} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Quote Section - Refined */}
            <div className="relative p-8 bg-slate-50 rounded-2xl border-r-4 border-secondary group hover:shadow-xl transition-all duration-500">
              <Quote className="absolute -top-4 left-6 text-secondary/20 group-hover:text-secondary/40 transition-colors" size={48} />
              <p className="italic text-slate-700 leading-relaxed font-semibold relative z-10">
                "مهمتنا هي تقديم تميز هندسي يفوق التوقعات، مع التركيز على الاستدامة والابتكار في كل تفصيلة إنشائية."
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
