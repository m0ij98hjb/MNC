import Navbar from "@/components/layout/Navbar";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "تواصل معنا – MNC",
  description: "تواصل مع شركة إم إن سي للمقاولات والاستشارات الهندسية. نحن هنا للإجابة على استفساراتك.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white font-cairo">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
            alt="تواصل معنا - شركة إم إن سي - جدة"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#0f172a]/35" />
          {/* Decorative golden lines */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #ca9e55 0px, #ca9e55 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #ca9e55 0px, #ca9e55 1px, transparent 1px, transparent 80px)"
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <div data-aos="fade-up">
            <span className="inline-block bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold tracking-widest px-4 py-2 rounded-full mb-6">
              شريككم الهندسي في المملكة العربية السعودية
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 font-heading leading-tight">
              تواصل معنا
              <span className="block text-secondary mt-2 text-2xl md:text-3xl">دعنا نحوّل رؤيتك إلى واقع</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              فريقنا الهندسي المتخصص جاهز لمناقشة مشروعك وتقديم أفضل الحلول الهندسية المتكاملة لك.
            </p>
          </div>

          {/* Quick contact pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-10" data-aos="fade-up" data-aos-delay="200">
            <a href="tel:0555057039" className="flex items-center gap-2 bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/50 text-white text-sm px-5 py-3 rounded-full transition-all duration-300">
              <Phone size={16} className="text-secondary" />
              0555057039
            </a>
            <a href="mailto:marwan@mnc.sa" className="flex items-center gap-2 bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/50 text-white text-sm px-5 py-3 rounded-full transition-all duration-300">
              <Mail size={16} className="text-secondary" />
              marwan@mnc.sa
            </a>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 text-white text-sm px-5 py-3 rounded-full">
              <MapPin size={16} className="text-secondary" />
              جدة، حي الشاطئ - طريق الملك
            </span>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-[#f1f5f9]" id="contact">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* Info Side */}
            <div className="lg:w-1/2 space-y-10" data-aos="fade-right">
              <div>
                <span className="text-secondary font-bold tracking-widest text-xs mb-3 block">معلومات التواصل</span>
                <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-slate-800">
                  هل أنت جاهز لبدء <br />
                  <span className="text-secondary">مشروعك القادم؟</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md">
                  فريقنا الهندسي مستعد لمناقشة تطلعاتكم وتحويلها إلى واقع ملموس. تواصل معنا اليوم للحصول على استشارة مهنية.
                </p>
              </div>

              <div className="space-y-5">
                <a href="tel:0555057039" className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shrink-0 shadow-sm">
                    <Phone className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">اتصل بنا</p>
                    <p className="text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors">0555057039</p>
                  </div>
                </a>

                <a href="mailto:marwan@mnc.sa" className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shrink-0 shadow-sm">
                    <Mail className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">البريد الإلكتروني</p>
                    <p className="text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors">marwan@mnc.sa</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shrink-0 shadow-sm">
                    <MapPin className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">الموقع</p>
                    <p className="text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors">جدة، حي الشاطئ - طريق الملك</p>
                  </div>
                </div>
              </div>

              {/* Decorative card */}
              <div className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/30 rounded-2xl p-6">
                <p className="text-secondary font-bold text-sm mb-2">أوقات الدوام</p>
                <p className="text-slate-800 font-semibold">الأحد – الخميس</p>
                <p className="text-slate-600 text-sm">8:00 صباحاً – 5:00 مساءً</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-1/2 w-full" data-aos="fade-left">
              <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg">
                <h3 className="text-slate-800 font-bold text-xl mb-6 text-center">أرسل رسالتك</h3>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 px-1">الاسم الكامل</label>
                      <input
                        type="text"
                        className="w-full bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-secondary outline-none transition-colors"
                        placeholder="أدخل اسمك هنا"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 px-1">رقم الجوال</label>
                      <input
                        type="tel"
                        className="w-full bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-secondary outline-none transition-colors"
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 px-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="w-full bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-secondary outline-none transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 px-1">نوع الخدمة</label>
                    <select className="w-full bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 focus:border-secondary outline-none transition-colors appearance-none">
                      <option>مشاريع مقاولات</option>
                      <option>تصميم معماري</option>
                      <option>إدارة مشاريع</option>
                      <option>أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 px-1">تفاصيل الرسالة</label>
                    <textarea
                      rows="4"
                      className="w-full bg-[#f8fafc] border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-secondary outline-none transition-colors resize-none"
                      placeholder="كيف يمكننا مساعدتك؟"
                    ></textarea>
                  </div>
                  <button type="button" className="w-full mt-2 bg-[#ca9e55] hover:bg-[#b08745] text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-lg">
                    إرسال الرسالة <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
