"use client";

import Navbar from "@/components/layout/Navbar";
import { Phone, Mail, MapPin, Send, ChevronDown, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t, lang, isRTL } = useLanguage();

  return (
    <main className="min-h-screen bg-[var(--background)] font-cairo text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="image-hero relative min-h-screen flex items-start lg:items-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/heroes/hero-contact.jpg"
            alt="Contact MNC"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Gradient: stronger on the start side for text readability */}
          <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/85 via-black/55 to-black/20`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-secondary to-transparent z-10" />

        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] z-0"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #D5B25D 0px, #D5B25D 1px, transparent 1px, transparent 80px)" }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-7xl py-6 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

            {/* Left / Start: title & CTA */}
            <div className={isRTL ? "text-right" : "text-left"} data-aos="fade-right">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-secondary/30 rounded-full px-5 py-2 mb-4 sm:mb-8`}>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-secondary text-xs font-bold tracking-widest uppercase">
                  {t('contactPage.typewriter')?.[0] || "تواصل معنا"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 font-heading leading-tight">
                {t('contact.ready')}
                <br />
                <span className="text-gradient">{t('contact.nextProject')}</span>
              </h1>

              <p className="text-white/70 text-sm sm:text-base md:text-xl leading-relaxed mb-6 sm:mb-10 max-w-lg font-medium">
                {t('contact.desc')}
              </p>

              <a
                href="#contact"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary to-[#E1BF67] text-black font-black px-8 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(213,178,93,0.35)] hover:shadow-[0_0_45px_rgba(213,178,93,0.5)] cursor-pointer"
              >
                {isRTL ? t('aboutUsPage.ctaBtn') || "ابدأ المشروع" : "Start a Project"}
                {isRTL ? <ArrowLeft size={20} /> : <ArrowLeft size={20} className="rotate-180" />}
              </a>
            </div>

            {/* Right / End: contact info cards — hidden on mobile (shown in form section below) */}
            <div className="space-y-4 hidden lg:block" data-aos="fade-left" data-aos-delay="150">
              {/* Phone */}
              <a
                href="tel:0598242385"
                className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-secondary/40 hover:bg-white/8 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/10 border border-secondary/20 shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Phone className="text-secondary" size={22} />
                </div>
                <div>
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('contact.phone')}</p>
                  <p className="text-white font-bold text-base">0598242385 – 0505649859</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:1@marwannazer.com"
                className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-secondary/40 hover:bg-white/8 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/10 border border-secondary/20 shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Mail className="text-secondary" size={22} />
                </div>
                <div>
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('contact.email')}</p>
                  <p className="text-white font-bold text-base">1@marwannazer.com</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-secondary/40 hover:bg-white/8 transition-all duration-300 group cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/10 border border-secondary/20 shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="text-secondary" size={22} />
                </div>
                <div>
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{t('contact.location')}</p>
                  <p className="text-white font-semibold text-sm leading-relaxed max-w-xs">{t('contactPage.address')}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-r from-secondary/12 to-secondary/5 border border-secondary/25 rounded-2xl p-5">
                <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">{t('contact.hours')}</p>
                <p className="text-white font-bold">{t('contact.days')}</p>
                <p className="text-white/55 text-sm mt-1">{t('contact.time')}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
      </section>

      {/* Contact Form Section */}
      <section className="py-10 sm:py-24 bg-[var(--card-bg)]" id="contact">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">

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
              <div className="bg-white/5 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group">
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
      <section className="py-10 sm:py-24 bg-[var(--background)] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center mb-8 sm:mb-16" data-aos="fade-up">
            <span className="text-secondary font-bold tracking-widest text-xs mb-3 block uppercase">{t('contactPage.locationBadge')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-white font-heading">{t('contactPage.visitTitle')}</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white/5 h-[300px] sm:h-[500px] group" data-aos="zoom-in">
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
