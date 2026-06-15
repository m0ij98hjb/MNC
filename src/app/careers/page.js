"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  Award, TrendingUp, Users, Building2,
  MapPin, Clock, Upload, Send, CheckCircle2,
  Briefcase, ChevronDown, FileText, ArrowDown,
} from "lucide-react";

const BENEFIT_ICONS = [Award, TrendingUp, Users, Building2];

export default function CareersPage() {
  const { t, lang, isRTL } = useLanguage();
  const [selectedPosition, setSelectedPosition] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const positionsRef = useRef(null);

  const benefits = t("careers.benefits");
  const positions = t("careers.positions");
  const expOptions = t("careers.expOptions");

  const handleApplyClick = (posTitle) => {
    setSelectedPosition(posTitle);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: formRef.current?.offsetTop - 100, behavior: "smooth" });
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedPosition("");
    setCvFile(null);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-white font-cairo">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="image-hero relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=85&w=2070&auto=format&fit=crop"
            alt="MNC Careers"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#070d1a]/97" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #B8923A 0px, #B8923A 1px, transparent 1px, transparent 80px)",
            }}
          />
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B8923A]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B8923A]/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl pt-32 pb-24">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#B8923A]/40 bg-[#B8923A]/10 text-[#B8923A] text-xs font-bold uppercase tracking-[3px] mb-8"
            data-aos="fade-down"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8923A] animate-pulse" />
            {t("careers.heroBadge")}
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t("careers.heroTitle")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8923A] via-[#E8D08A] to-[#B8923A]">
              {t("careers.heroSubtitle")}
            </span>
          </h1>

          <p
            className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t("careers.heroDesc")}
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <button
              onClick={() =>
                positionsRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="group px-8 py-4 rounded-xl bg-[#B8923A] text-black font-black text-sm hover:bg-[#D5B25D] transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-[#B8923A]/30 flex items-center gap-2"
            >
              {t("careers.exploreBtn")}
              <ArrowDown size={15} className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() =>
                formRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 rounded-xl border border-[#B8923A]/40 text-[#B8923A] font-black text-sm hover:bg-[#B8923A]/10 hover:border-[#B8923A]/70 transition-all duration-300 hover:-translate-y-1"
            >
              {t("careers.applyBtn")}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-[#B8923A] to-transparent" />
        </div>
      </section>

      {/* ===== WHY JOIN US ===== */}
      <section className="py-28 bg-[var(--card-bg)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #B8923A 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#B8923A] text-xs font-bold uppercase tracking-[3px] mb-3 block">
              {t("careers.whyBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              {t("careers.whyTitle")}
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {t("careers.whySubtitle")}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#B8923A] to-[#D5B25D] mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(benefits) &&
              benefits.map((benefit, i) => {
                const Icon = BENEFIT_ICONS[i];
                return (
                  <div
                    key={i}
                    className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-7 hover:border-[#B8923A]/35 hover:bg-[#B8923A]/5 transition-all duration-500 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                  >
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#B8923A]/5 group-hover:bg-[#B8923A]/12 transition-all duration-500 blur-xl" />
                    <div className="w-12 h-12 rounded-xl bg-[#B8923A]/12 border border-[#B8923A]/20 flex items-center justify-center text-[#B8923A] mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-white font-black text-base mb-2.5">
                      {benefit.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ===== OPEN POSITIONS ===== */}
      <section
        ref={positionsRef}
        className="py-28 bg-[var(--background)] relative"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#B8923A] text-xs font-bold uppercase tracking-[3px] mb-3 block">
              {t("careers.positionsBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              {t("careers.positionsTitle")}
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {t("careers.positionsSubtitle")}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#B8923A] to-[#D5B25D] mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.isArray(positions) &&
              positions.map((pos, i) => (
                <div
                  key={i}
                  className="group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#B8923A]/30 hover:bg-[#B8923A]/4 transition-all duration-400 flex flex-col gap-4 overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={i * 60}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#B8923A]/0 to-transparent group-hover:via-[#B8923A]/50 transition-all duration-500" />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B8923A]/12 text-[#B8923A] text-[10px] font-black uppercase tracking-widest mb-2.5 border border-[#B8923A]/20">
                        {pos.dept}
                      </span>
                      <h3 className="text-white font-black text-xl leading-tight">
                        {pos.title}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#B8923A]/8 border border-[#B8923A]/15 flex items-center justify-center text-[#B8923A] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#B8923A]/15 transition-all duration-300">
                      <Briefcase size={19} />
                    </div>
                  </div>

                  <p className="text-white/55 text-sm leading-relaxed flex-1">
                    {pos.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className={`flex items-center gap-4 text-white/35 text-xs ${isRTL ? "flex-row" : ""}`}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {t("careers.jeddah")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} />
                        {t("careers.fullTime")}
                      </span>
                    </div>
                    <button
                      onClick={() => handleApplyClick(pos.title)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8923A] to-[#C9A34D] text-black font-black text-xs hover:shadow-lg hover:shadow-[#B8923A]/25 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                    >
                      {t("careers.applyNow")}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ===== APPLICATION FORM ===== */}
      <section ref={formRef} className="py-28 bg-[var(--card-bg)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #B8923A 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B8923A]/30 to-transparent" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="text-[#B8923A] text-xs font-bold uppercase tracking-[3px] mb-3 block">
              {t("careers.formBadge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {t("careers.formTitle")}
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {t("careers.formSubtitle")}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#B8923A] to-[#D5B25D] mx-auto mt-6 rounded-full" />
          </div>

          {submitted ? (
            /* SUCCESS STATE */
            <div
              className="bg-gradient-to-br from-[#B8923A]/10 to-[#B8923A]/5 border border-[#B8923A]/25 rounded-3xl p-14 text-center"
              data-aos="zoom-in"
            >
              <div className="relative inline-block mb-7">
                <div className="w-24 h-24 rounded-full bg-[#B8923A]/15 border border-[#B8923A]/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={44} className="text-[#B8923A]" />
                </div>
                <div className="absolute inset-0 rounded-full bg-[#B8923A]/10 blur-xl animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">
                {t("careers.successTitle")}
              </h3>
              <p className="text-white/60 leading-relaxed max-w-md mx-auto mb-10 text-base">
                {t("careers.successDesc")}
              </p>
              <button
                onClick={handleReset}
                className="px-10 py-4 rounded-xl bg-[#B8923A] text-black font-black text-sm hover:bg-[#D5B25D] transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-[#B8923A]/25"
              >
                {t("careers.successBtn")}
              </button>
            </div>
          ) : (
            /* FORM */
            <div
              className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 md:p-10 relative overflow-hidden"
              data-aos="fade-up"
            >
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#B8923A]/6 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#B8923A]/4 rounded-full blur-3xl pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Row: Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                      {t("careers.fullName")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("careers.namePlaceholder")}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-[#B8923A]/60 focus:bg-black/60 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                      {t("careers.phone")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={t("careers.phonePlaceholder")}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-[#B8923A]/60 focus:bg-black/60 outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                    {t("careers.email")}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t("careers.emailPlaceholder")}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-[#B8923A]/60 focus:bg-black/60 outline-none transition-all duration-300"
                  />
                </div>

                {/* Row: Position + Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                      {t("careers.position")}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        className={`w-full bg-black/40 border border-white/10 rounded-xl py-3.5 text-sm text-white focus:border-[#B8923A]/60 outline-none transition-all duration-300 appearance-none cursor-pointer ${isRTL ? "pe-4 ps-10" : "ps-4 pe-10"}`}
                      >
                        <option value="" className="bg-[#111]">
                          {t("careers.choosePosition")}
                        </option>
                        {Array.isArray(positions) &&
                          positions.map((pos, i) => (
                            <option key={i} value={pos.title} className="bg-[#111]">
                              {pos.title}
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/40 pointer-events-none`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                      {t("careers.experience")}
                    </label>
                    <div className="relative">
                      <select
                        required
                        className={`w-full bg-black/40 border border-white/10 rounded-xl py-3.5 text-sm text-white focus:border-[#B8923A]/60 outline-none transition-all duration-300 appearance-none cursor-pointer ${isRTL ? "pe-4 ps-10" : "ps-4 pe-10"}`}
                      >
                        <option value="" className="bg-[#111]">--</option>
                        {Array.isArray(expOptions) &&
                          expOptions.map((opt, i) => (
                            <option key={i} value={opt} className="bg-[#111]">
                              {opt}
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-white/40 pointer-events-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                    {t("careers.coverLetter")}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={t("careers.coverLetterPlaceholder")}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:border-[#B8923A]/60 focus:bg-black/60 outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {/* CV Upload */}
                <div className="space-y-2">
                  <label className="text-[#B8923A] text-[11px] font-black uppercase tracking-widest block">
                    {t("careers.cvUpload")}
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("cvFileInput").click()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? "border-[#B8923A] bg-[#B8923A]/12 scale-[1.01]"
                        : cvFile
                        ? "border-[#B8923A]/60 bg-[#B8923A]/8"
                        : "border-white/12 hover:border-[#B8923A]/35 hover:bg-white/3"
                    }`}
                  >
                    <input
                      id="cvFileInput"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCvFile(file);
                      }}
                      className="hidden"
                    />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#B8923A]/20 border border-[#B8923A]/30 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-[#B8923A]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-white font-bold text-sm leading-tight">
                            {cvFile.name}
                          </p>
                          <p className="text-[#B8923A] text-xs mt-0.5 font-bold">
                            {t("careers.cvUploaded")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Upload size={22} className="text-white/30" />
                        </div>
                        <p className="text-white/40 text-sm font-medium">
                          {t("careers.cvUploadHint")}
                        </p>
                        <p className="text-white/20 text-xs">PDF, DOC, DOCX</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-[#B8923A] to-[#C9A34D] hover:from-[#C9A34D] hover:to-[#D5B25D] text-black font-black py-4.5 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-2xl shadow-[#B8923A]/20 hover:-translate-y-1 active:scale-95"
                >
                  <Send size={17} />
                  {t("careers.submitApplication")}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
