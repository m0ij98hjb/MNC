"use client";

import Navbar from "@/components/layout/Navbar";
import TypewriterText from "@/components/TypewriterText";
import { Phone, Mail, MapPin, Send, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, lang, isRTL } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] font-cairo text-white">
      <Navbar />

      {/* Re-applying High-End Engineering Hero Section with Localization */}
      <section className="relative pt-20 pb-4 lg:pt-32 lg:pb-12 overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="MNC Engineering & Construction"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          {/* Multi-layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/60 to-[#0f172a]/90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          
          {/* Animated geometric lines (Blueprint Grid) */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #ca9e55 0px, #ca9e55 1px, transparent 1px, transparent 100px)"
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">

            <div className="mb-4">
              <TypewriterText
                texts={t('contactPage.typewriter')}
                typingSpeed={120}
                deletingSpeed={60}
                pauseDuration={2000}
                loop={true}
                className="text-[var(--foreground)] text-xl md:text-3xl font-bold opacity-90"
              />
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[var(--foreground)] mb-6 font-heading leading-[1.2] md:leading-[1.1] tracking-tight" data-aos="fade-up" data-aos-delay="200">
              {t('hero.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#f3d091] to-secondary text-xl md:text-4xl lg:text-5xl">
                {t('hero.subtitle')}
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-[var(--foreground)]/70 leading-relaxed max-w-2xl mx-auto font-medium px-4 md:px-0" data-aos="fade-up" data-aos-delay="400">
              {t('hero.description')}
            </p>

            {/* Decorative Scroll Indicator */}
            <div className="mt-16 flex flex-col items-center gap-4 animate-bounce opacity-40">
              <span className="text-[var(--foreground)] text-[10px] uppercase tracking-[0.3em] font-bold">
                {t('contactPage.explore')}
              </span>
              <div className="w-0.5 h-12 bg-gradient-to-b from-secondary to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-12 md:h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-[var(--card-bg)]" id="contact">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            {/* Info Side */}
            <div className="w-full lg:w-1/2 space-y-10" data-aos="fade-right">
              <div>
                <span className="text-secondary font-bold tracking-widest text-xs mb-3 block">{t('contact.info')}</span>
                <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-white" data-aos="fade-up" data-aos-delay="100">
                  {t('contact.ready')} <br />
                  <span className="text-secondary">{t('contact.nextProject')}</span>
                </h2>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">
                  {t('contact.desc')}
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-5 group cursor-pointer" data-aos="fade-up" data-aos-delay="200">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#D5B25D]/30 bg-[#D5B25D]/10 group-hover:border-[var(--secondary)] transition-all duration-300 shadow-sm shrink-0">
                    <Phone className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider mb-1">{t('contact.phone')}</p>
                    <p className="text-lg font-bold text-white group-hover:text-[var(--secondary)] transition-colors">0598242385 - 0505649859</p>
                  </div>
                </div>

                <a href="mailto:1@marwannazer.com" className="flex items-center gap-5 group cursor-pointer" data-aos="fade-up" data-aos-delay="300">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#D5B25D]/30 bg-[#D5B25D]/10 group-hover:border-secondary transition-all duration-300 shadow-sm shrink-0">
                    <Mail className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider mb-1">{t('contact.email')}</p>
                    <p className="text-lg font-bold text-white group-hover:text-[var(--secondary)] transition-colors">1@marwannazer.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group cursor-default" data-aos="fade-up" data-aos-delay="400">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#D5B25D]/30 bg-[#D5B25D]/10 group-hover:border-secondary transition-all duration-300 shadow-sm shrink-0">
                    <MapPin className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-[#D5B25D] text-xs font-bold uppercase tracking-wider mb-1">{t('contact.location')}</p>
                    <p className="text-base font-bold text-white group-hover:text-[var(--secondary)] transition-colors leading-relaxed font-sans max-w-sm">{t('contactPage.address')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary/15 to-transparent border border-secondary/20 rounded-2xl p-6" data-aos="fade-up" data-aos-delay="500">
                <p className="text-secondary font-black text-sm mb-2 uppercase tracking-wider">{t('contact.hours')}</p>
                <p className="text-white font-bold">{t('contact.days')}</p>
                <p className="text-white/60 text-sm mt-1">{t('contact.time')}</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-1/2 w-full" data-aos="fade-left">
              <div className="bg-white/5 p-8 md:p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700"></div>
                
                <form className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#D5B25D] px-1 uppercase tracking-wider">{t('contact.form.name')}</label>
                      <input 
                        type="text" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[var(--secondary)] focus:bg-black/60 outline-none transition-all duration-300 shadow-sm" 
                        placeholder={t('contactPage.formNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#D5B25D] px-1 uppercase tracking-wider">{t('contact.form.phone')}</label>
                      <input 
                        type="tel" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[var(--secondary)] focus:bg-black/60 outline-none transition-all duration-300 shadow-sm" 
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#D5B25D] px-1 uppercase tracking-wider">{t('contact.form.service')}</label>
                    <div className="relative">
                      <select className={`w-full bg-black/40 border border-white/10 rounded-xl ${isRTL ? 'pe-4 ps-10' : 'ps-4 pe-10'} py-3.5 text-sm text-white focus:border-[var(--secondary)] focus:bg-black/60 outline-none transition-all duration-300 shadow-sm appearance-none cursor-pointer`}>
                        <option value="construction" className="bg-black text-white">{t('contactPage.formServiceOptions.construction')}</option>
                        <option value="architecture" className="bg-black text-white">{t('contactPage.formServiceOptions.architecture')}</option>
                        <option value="management" className="bg-black text-white">{t('contactPage.formServiceOptions.management')}</option>
                        <option value="other" className="bg-black text-white">{t('contactPage.formServiceOptions.other')}</option>
                      </select>
                      <ChevronDown className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-white/50 pointer-events-none`} size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#D5B25D] px-1 uppercase tracking-wider">{t('contact.form.message')}</label>
                    <textarea 
                      rows="4" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[var(--secondary)] focus:bg-black/60 outline-none transition-all duration-300 shadow-sm resize-none" 
                      placeholder={t('contactPage.formMessagePlaceholder')}
                    ></textarea>
                  </div>
                  <button type="button" className="w-full mt-4 bg-[var(--secondary)] hover:bg-[#E1BF67] text-black font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-xl shadow-secondary/20 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
                    {t('contact.form.submit')} <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-[var(--background)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-secondary font-bold tracking-widest text-xs mb-3 block uppercase">{t('contactPage.locationBadge')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-heading">{t('contactPage.visitTitle')}</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/5 h-[500px] group" data-aos="zoom-in">
            <iframe 
              src="https://www.google.com/maps?q=Consultant+Marwan+Ahmed+Nazer+Engineering+Consultancy+Jeddah&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.6] contrast-[1.2] invert-[0.9] hue-rotate-[180deg] hover:grayscale-0 hover:invert-0 hover:hue-rotate-0 transition-all duration-700"
            ></iframe>
            
            {/* Floating Info Card on Map */}
            <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} bg-black/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 max-w-xs hidden md:block`}>
              <h3 className="font-bold text-white mb-2">{t('contactPage.mapTitle')}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{t('contactPage.mapDesc')}</p>
              <a 
                href="https://maps.google.com/maps?q=Consultant+Marwan+Ahmed+Nazer+Engineering+Consultancy+Jeddah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-secondary text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#E1BF67] transition-colors"
              >
                {t('contactPage.openMaps')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
