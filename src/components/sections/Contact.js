"use client";

import { Phone, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-[#f1f5f9] overflow-hidden font-cairo">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Info Side (Right in RTL) */}
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-10" data-aos="fade-up">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs mb-3 block text-center lg:text-right">تواصل معنا</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight text-slate-800 text-center lg:text-right">
                هل أنت جاهز لبدء <br />
                <span className="text-secondary">مشروعك القادم؟</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 text-center lg:text-right">
                فريقنا الهندسي مستعد لمناقشة تطلعاتكم وتحويلها إلى واقع ملموس. تواصل معنا اليوم للحصول على استشارة مهنية.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-5 group cursor-default justify-center lg:justify-start rtl:lg:justify-end">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shadow-sm shrink-0">
                  <Phone className="text-secondary" size={18} md:size={20} />
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-slate-500 text-[10px] md:text-xs mb-0.5">اتصل بنا</p>
                  <p className="text-base md:text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors line-clamp-1">0598242385 - 0505649859</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-5 group cursor-default justify-center lg:justify-start rtl:lg:justify-end">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shadow-sm shrink-0">
                  <Mail className="text-secondary" size={18} md:size={20} />
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-slate-500 text-[10px] md:text-xs mb-0.5">البريد الإلكتروني</p>
                  <p className="text-base md:text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors">1@marwannazer.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-5 group cursor-default justify-center lg:justify-start rtl:lg:justify-end">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-slate-300 bg-white group-hover:border-secondary transition-all duration-300 shadow-sm shrink-0">
                  <MapPin className="text-secondary" size={18} md:size={20} />
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-slate-500 text-[10px] md:text-xs mb-0.5">الموقع</p>
                  <p className="text-base md:text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors text-xs md:text-sm">حي الأندلس – شارع عبدالرحمن الطبيشي. فيلا 72 – جدة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side (Left in RTL) */}
          <div className="lg:w-1/2 w-full" data-aos="fade-up">
            <div className="bg-[#1e293b] p-6 sm:p-8 md:p-10 rounded-2xl border border-slate-700 shadow-2xl">
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 px-1">الاسم الكامل</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-secondary outline-none transition-colors" 
                      placeholder="أدخل اسمك هنا"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 px-1">رقم الجوال</label>
                    <input 
                      type="tel" 
                      className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-secondary outline-none transition-colors" 
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 px-1">نوع الخدمة</label>
                  <select className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-secondary outline-none transition-colors appearance-none">
                    <option className="bg-slate-800">مشاريع مقاولات</option>
                    <option className="bg-slate-800">تصميم معماري</option>
                    <option className="bg-slate-800">إدارة مشاريع</option>
                    <option className="bg-slate-800">أخرى</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 px-1">تفاصيل الرسالة</label>
                  <textarea 
                    rows="4" 
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-sm text-white focus:border-secondary outline-none transition-colors resize-none" 
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
  );
};

export default Contact;
