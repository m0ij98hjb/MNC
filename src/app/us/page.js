"use client";

import Image from "next/image";
import Link from "next/link";
import TypewriterText from "@/components/TypewriterText";
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutUsPage() {
  const { lang, t, isRTL } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] font-cairo text-white" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-6 font-heading">
              <TypewriterText
                texts={t("aboutUsPage.titleTypewriter") || ["Get to Know Us", "MNC Contracting"]}
                typingSpeed={120}
                deletingSpeed={60}
                pauseDuration={2000}
                loop={true}
                className="text-[var(--foreground)]"
                textClassNames={["", "text-secondary"]}
              />
            </h1>
            <p className="text-xl text-[var(--foreground)]/80 leading-relaxed font-semibold" data-aos="fade-up" data-aos-delay="300">
              {t("aboutUsPage.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-[var(--background)] relative overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-[#D5B25D]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text Content - Column 1 (renders Right in RTL, Left in LTR) */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-start" data-aos="fade-up">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white font-heading relative inline-block">
                  {t("aboutUsPage.visionHistoryTitle")}
                  <span className={`absolute -bottom-2.5 ${isRTL ? 'right-0' : 'left-0'} w-2/3 h-1 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] rounded-full`} />
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-white/70 font-medium">
                  {t("aboutUsPage.visionHistoryDesc")}
                </p>
              </div>

              {/* CEO Quote - Premium Gold Glass Card */}
              <div className={`bg-white/5 backdrop-blur-md p-6 rounded-2xl ${isRTL ? 'border-r-4 border-r-[#D5B25D]' : 'border-l-4 border-l-[#D5B25D]'} border-t border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden`} data-aos="fade-up" data-aos-delay="100">
                <div className={`absolute -top-6 ${isRTL ? '-left-6' : '-right-6'} opacity-10 text-white select-none pointer-events-none text-9xl font-serif`}>
                  ”
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-white/90 font-medium relative z-10">
                  {t("aboutUsPage.ceoQuote")}
                </p>
              </div>

              {/* Values/Goals List */}
              <div className="space-y-6 pt-2">
                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`} data-aos="fade-up" data-aos-delay="200">
                  <div className="w-12 h-12 rounded-2xl bg-[#D5B25D]/10 border border-[#D5B25D]/20 flex items-center justify-center shrink-0 shadow-lg">
                    <Target className="text-[#D5B25D]" size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-1.5">{t("aboutUsPage.goalTitle")}</h3>
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                      {t("aboutUsPage.goalDesc")}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`} data-aos="fade-up" data-aos-delay="300">
                  <div className="w-12 h-12 rounded-2xl bg-[#D5B25D]/10 border border-[#D5B25D]/20 flex items-center justify-center shrink-0 shadow-lg">
                    <Building2 className="text-[#D5B25D]" size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-1.5">{t("aboutUsPage.projectsTitle")}</h3>
                    <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                      {t("aboutUsPage.projectsDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Grid - Column 2 (renders Left in RTL, Right in LTR) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch" data-aos="fade-up">
              {/* Stacked Images Column */}
              <div className={`grid grid-rows-2 gap-6 ${isRTL ? 'order-last md:order-2' : 'order-first md:order-1'}`}>
                <div className="relative h-[220px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                  <Image src="/project1.png" alt="MNC Residential Project" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500" />
                  <div className={`absolute bottom-4 ${isRTL ? 'right-4 text-right' : 'left-4 text-left'}`}>
                    <span className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full border border-[#D5B25D]/20">{t("gallery.distinctive")}</span>
                  </div>
                </div>
                
                <div className="relative h-[220px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                  <Image src="/project2.png" alt="MNC Commercial Project" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500" />
                  <div className={`absolute bottom-4 ${isRTL ? 'right-4 text-right' : 'left-4 text-left'}`}>
                    <span className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full border border-[#D5B25D]/20">{t("gallery.distinctive")}</span>
                  </div>
                </div>
              </div>

              {/* Tall Image (Hero) */}
              <div className={`relative h-[350px] sm:h-[450px] md:h-full min-h-[350px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer ${isRTL ? 'order-first md:order-1' : 'order-last md:order-2'}`}>
                <Image src="/hero.png" alt="MNC Engineering" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500" />
                <div className={`absolute bottom-6 ${isRTL ? 'right-6 text-right' : 'left-6 text-left'}`}>
                  <span className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full border border-[#D5B25D]/20">{t("gallery.distinctive")}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Executive Director Section */}
      <section className="py-24 bg-[var(--background)] border-t border-white/5 relative overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[300px] h-[300px] bg-[#D5B25D]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className={`relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${isRTL ? 'order-last' : 'order-first'}`} data-aos={isRTL ? 'fade-left' : 'fade-right'}>
              <Image 
                src="/asstes/director_ar.png" 
                alt={t("aboutUsPage.ceoSectionTitle")}
                fill 
                className="object-cover" 
              />
            </div>

            {/* Text Content */}
            <div className={`space-y-6 lg:space-y-8 ${isRTL ? 'order-first text-right' : 'order-last text-left'}`} data-aos={isRTL ? 'fade-right' : 'fade-left'}>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h2 className="text-3xl md:text-4xl font-black text-white font-heading mb-4" data-aos="fade-up" data-aos-delay="100">
                  {t("aboutUsPage.ceoSectionTitle")}
                </h2>
                <div className={`w-16 h-1 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] ${isRTL ? 'mr-0 ml-auto lg:mr-0' : 'ml-0 mr-auto lg:ml-0'} mb-6 lg:mb-8 rounded-full`}></div>
                
                <div className="space-y-6 text-base md:text-lg leading-relaxed text-white/70 font-medium">
                  <p>
                    {t("aboutUsPage.ceoSectionText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-6 max-w-7xl mt-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#D5B25D]"></span>
              <span className="text-[#D5B25D] font-bold tracking-widest uppercase text-xs">
                {t("aboutUsPage.teamBadge")}
              </span>
              <span className="h-px w-8 bg-[#D5B25D]"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-white leading-tight">
              {t("aboutUsPage.teamTitle")}
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed font-medium">
              {t("aboutUsPage.teamDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Team Card 1 */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-[#D5B25D]/30 transition-all duration-500 bg-white/5" data-aos="fade-up" data-aos-delay="100">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/asstes/team1.png"
                  alt="MNC Team"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Fixed White-text overlay bug by using dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`absolute bottom-0 ${isRTL ? 'left-0 text-right' : 'right-0 text-left'} w-full p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
                    {t("aboutUsPage.teamStaffTitle")}
                  </h3>
                  <p className="text-[#D5B25D] text-sm md:text-base font-semibold">
                    {t("aboutUsPage.teamStaffDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Card 2 */}
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-[#D5B25D]/30 transition-all duration-500 bg-white/5" data-aos="fade-up" data-aos-delay="200">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/asstes/team2.png"
                  alt="MNC Team"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Fixed White-text overlay bug by using dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`absolute bottom-0 ${isRTL ? 'left-0 text-right' : 'right-0 text-left'} w-full p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-2">
                    {t("aboutUsPage.teamFieldTitle")}
                  </h3>
                  <p className="text-[#D5B25D] text-sm md:text-base font-semibold">
                    {t("aboutUsPage.teamFieldDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
        {/* Glowing gold ambient light behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#D5B25D]/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(to right, #D5B25D 1px, transparent 1px), linear-gradient(to bottom, #D5B25D 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 font-heading leading-tight" data-aos="fade-up">
            {t("aboutUsPage.ctaTitle")}
          </h2>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] text-black font-black px-10 py-4.5 rounded-full text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(213,178,93,0.3)] hover:shadow-[0_0_40px_rgba(213,178,93,0.5)] cursor-pointer" data-aos="fade-up" data-aos-delay="200">
            <span>{t("aboutUsPage.ctaBtn")}</span>
            {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </Link>
        </div>
      </section>
    </main>
  );
}
