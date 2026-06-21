"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import {
  Home,
  Building2,
  Factory,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Calculator,
  RotateCcw,
  TrendingUp,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Waves,
  Zap,
  Sun,
  Cpu,
  Flower2,
  SquareStack,
  Phone,
} from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────
export default function CostCalculatorPage() {
  const { t, lang, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { data: calcCms } = useSiteContent('calculator');
  const isLightMode = theme === 'dark';
  const isRtl = isRTL;
  // Light mode helper classes
  const cardCls = isLightMode ? 'bg-white border border-slate-200 shadow-sm' : 'bg-white/5 border border-white/10';
  const textPri = isLightMode ? 'text-[#1e293b]' : 'text-white';
  const textMut = isLightMode ? 'text-slate-400' : 'text-white/40';
  const textSec = isLightMode ? 'text-slate-500' : 'text-white/60';

  const fmt = (n) => {
    const locale = (lang === "ar" || lang === "ur") ? "ar-SA" : "en-US";
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
  };

  const ui = {
    next: {
      ar: "التالي", en: "Next", zh: "下一步", es: "Siguiente",
      fr: "Suivant", de: "Weiter", tr: "İleri", ur: "اگلا"
    },
    back: {
      ar: "السابق", en: "Back", zh: "上一步", es: "Atrás",
      fr: "Retour", de: "Zurück", tr: "Geri", ur: "پیچھے"
    },
    backToHome: {
      ar: "العودة إلى الرئيسية", en: "Back to Home", zh: "返回首页", es: "Volver al inicio",
      fr: "Retour à l'accueil", de: "Zurück zur Startseite", tr: "Ana Sayفaya Dön", ur: "ہوم پیج پر واپس"
    },
    processing: {
      ar: "نعمل على تحليل بيانات مشروعك...",
      en: "Processing your project specifications...",
      zh: "正在处理您的项目规格...",
      es: "Procesando las especificaciones de su proyecto...",
      fr: "Traitement des spécifications de votre projet...",
      de: "Verarbeitung Ihrer Projektspezifikationen...",
      tr: "Proje özellikleriniz işleniyor...",
      ur: "آپ کے پروجیکٹ کی تفصیلات پر کارروائي کی جا رہی ہے..."
    }
  };

  const generateInsights = ({ type, area, quality, location, extras, costPerSqm }) => {
    const list = [];

    if (quality === "premium" || quality === "ultra") {
      list.push(t("calculator.insights.premium"));
    }
    if (area > 1000) {
      list.push(t("calculator.insights.large"));
    }
    if (extras.includes("solar")) {
      list.push(t("calculator.insights.solar"));
    }
    if (extras.includes("smart")) {
      list.push(t("calculator.insights.smart"));
    }
    if (location === "mecca") {
      list.push(t("calculator.insights.mecca"));
    }
    if (type === "renovation") {
      list.push(t("calculator.insights.renovation"));
    }

    // Format the range insight template
    const minVal = fmt(costPerSqm * 0.9);
    const maxVal = fmt(costPerSqm * 1.1);
    
    // Resolve location name
    const locName = t(`calculator.${location}`);
    
    let rangeTemplate = t("calculator.insights.range");
    if (rangeTemplate && typeof rangeTemplate === "string") {
      rangeTemplate = rangeTemplate
        .replace("{location}", locName)
        .replace("{min}", minVal)
        .replace("{max}", maxVal);
      list.push(rangeTemplate);
    }

    return list;
  };

  const calculateProjectCost = ({ type, area, floors, quality, location, extras }) => {
    const BASE_RATES = calcCms?.rates || {
      residential: { economic: 1800, standard: 2500, premium: 3800, ultra: 6000 },
      commercial:  { economic: 2200, standard: 3200, premium: 5000, ultra: 8000 },
      industrial:  { economic: 1500, standard: 2000, premium: 3000, ultra: 5000 },
      renovation:  { economic: 800,  standard: 1400, premium: 2200, ultra: 3500 },
    };

    const LOCATION_MULTIPLIER = {
      jeddah: 1.0,
      riyadh: 1.05,
      mecca: 1.1,
      dammam: 0.98,
      other_city: 0.92,
    };

    const EXTRAS_COST = {
      pool: 180000,
      elevator: 120000,
      solar: 85000,
      smart: 95000,
      landscape: 65000,
      basement: area * 600,
    };

    const baseRate = BASE_RATES[type]?.[quality] || 2500;
    const totalArea = area * floors;
    const locationMult = LOCATION_MULTIPLIER[location] || 1.0;
    const baseTotal = totalArea * baseRate * locationMult;

    let extrasTotal = 0;
    extras.forEach((ex) => { extrasTotal += EXTRAS_COST[ex] || 0; });

    const structurePct = type === "renovation" ? 0.30 : 0.40;
    const finishingPct = type === "renovation" ? 0.45 : 0.30;
    const mepPct = 0.20;
    const externalPct = 0.07;
    const contingencyPct = 0.03;

    const structure   = baseTotal * structurePct;
    const finishing   = baseTotal * finishingPct;
    const mep         = baseTotal * mepPct;
    const external    = baseTotal * externalPct;
    const contingency = baseTotal * contingencyPct;

    const total = baseTotal + extrasTotal;
    const min = total * 0.88;
    const max = total * 1.18;

    // Timeline (months)
    const timeline = Math.ceil(totalArea / 800 + floors * 1.5 + (extras.length * 0.5));

    // AI Insights
    const insights = generateInsights({ type, area: totalArea, quality, location, extras, costPerSqm: baseRate * locationMult });

    return {
      min: Math.round(min),
      max: Math.round(max),
      avg: Math.round(total),
      costPerSqm: Math.round(baseRate * locationMult),
      breakdown: {
        structure: Math.round(structure),
        finishing: Math.round(finishing),
        mep: Math.round(mep),
        external: Math.round(external),
        contingency: Math.round(contingency),
        extras: Math.round(extrasTotal),
      },
      timeline,
      insights,
    };
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    area: "",
    floors: "1",
    quality: "standard",
    location: "jeddah",
    extras: [],
  });
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [errors, setErrors] = useState({});

  const projectTypes = [
    { key: "residential", icon: Home, color: "#D5B25D" },
    { key: "commercial",  icon: Building2, color: "#60a5fa" },
    { key: "industrial",  icon: Factory, color: "#34d399" },
    { key: "renovation",  icon: Wrench, color: "#f472b6" },
  ];

  const qualityOptions = [
    { key: "economic", color: "#64748b", label: t("calculator.economic") },
    { key: "standard", color: "#D5B25D", label: t("calculator.standard") },
    { key: "premium",  color: "#f59e0b", label: t("calculator.premium") },
    { key: "ultra",    color: "#a855f7", label: t("calculator.ultra") },
  ];

  const locationOptions = [
    { key: "jeddah", label: t("calculator.jeddah") },
    { key: "riyadh", label: t("calculator.riyadh") },
    { key: "mecca",  label: t("calculator.mecca") },
    { key: "dammam", label: t("calculator.dammam") },
    { key: "other_city", label: t("calculator.other_city") },
  ];

  const extrasOptions = [
    { key: "pool",      icon: Waves,       label: t("calculator.pool"),      cost: "180,000" },
    { key: "elevator",  icon: SquareStack, label: t("calculator.elevator"),  cost: "120,000" },
    { key: "solar",     icon: Sun,         label: t("calculator.solar"),     cost: "85,000"  },
    { key: "smart",     icon: Cpu,         label: t("calculator.smart"),     cost: "95,000"  },
    { key: "landscape", icon: Flower2,     label: t("calculator.landscape"), cost: "65,000"  },
    { key: "basement",  icon: SquareStack, label: t("calculator.basement"),  cost: "+" },
  ];

  const validateStep1 = () => {
    if (!formData.type) {
      setErrors({ type: true });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.area || isNaN(formData.area) || Number(formData.area) < 50)
      e.area = true;
    if (Object.keys(e).length) { setErrors(e); return false; }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 2) {
      runCalculation();
      return;
    }
    setStep((s) => s + 1);
  };

  const runCalculation = () => {
    setCalculating(true);
    setTimeout(() => {
      const res = calculateProjectCost({
        type: formData.type,
        area: Number(formData.area),
        floors: Number(formData.floors),
        quality: formData.quality,
        location: formData.location,
        extras: formData.extras,
      });
      setResult(res);
      setCalculating(false);
      setStep(3);
    }, 1800);
  };

  const toggleExtra = (key) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.includes(key)
        ? prev.extras.filter((e) => e !== key)
        : [...prev.extras, key],
    }));
  };

  const reset = () => {
    setStep(1);
    setResult(null);
    setFormData({ type: "", area: "", floors: "1", quality: "standard", location: "jeddah", extras: [] });
    setErrors({});
  };

  const breakdownKeys = ["structure", "finishing", "mep", "external", "contingency"];
  const breakdownColors = ["#D5B25D", "#60a5fa", "#34d399", "#f472b6", "#f59e0b"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative pt-36 sm:pt-44 md:pt-48 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d1526] to-black" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #D5B25D 0%, transparent 60%), radial-gradient(circle at 70% 30%, #B8923A 0%, transparent 50%)" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#D5B25D]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(to right, #D5B25D 1px, transparent 1px), linear-gradient(to bottom, #D5B25D 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D5B25D]/30 bg-[#D5B25D]/10 mb-6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D5B25D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v5c0 5 4 9.3 9 10.5C17 21.3 21 17 21 12V7l-9-5z"/>
            </svg>
            <span className="text-[#D5B25D] text-xs font-bold tracking-widest uppercase">{t("calculator.badge")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight text-white">
            <span className="text-gradient">{t("calculator.title")}</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-[#D5B25D] to-[#E1BF67] mx-auto mb-6 rounded-full" />
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/70">
            {t("calculator.subtitle")}
          </p>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className={`sticky top-[72px] lg:top-[104px] z-40 backdrop-blur-xl border-b ${isLightMode ? 'bg-white/90 border-[#D5B25D]/20' : 'bg-black/80 border-[#D5B25D]/10'}`}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center gap-2 sm:gap-4">
                <div className={`flex items-center gap-2 transition-all duration-300 ${step >= s ? "opacity-100" : "opacity-40"}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                    step > s ? "bg-[#D5B25D] text-black" : step === s ? "bg-[#D5B25D]/20 border-2 border-[#D5B25D] text-[#D5B25D]" : isLightMode ? "bg-slate-100 border border-slate-300 text-slate-400" : "bg-white/5 border border-white/20 text-white/40"
                  }`}>
                    {step > s ? <CheckCircle2 size={14} /> : s}
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold hidden sm:block ${step === s ? "text-[#D5B25D]" : textMut}`}>
                    {t(`calculator.step${s}`)}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`w-8 sm:w-16 h-px transition-all duration-500 ${step > s + 0 ? "bg-[#D5B25D]" : isLightMode ? "bg-slate-200" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">

        {/* ── STEP 1: Project Type ── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl sm:text-3xl font-black text-center mb-8 ${textPri}`}>
              {t("calculator.projectType")}
            </h2>
            {errors.type && (
              <p className="text-red-400 text-sm text-center mb-4">{t("calculator.required")}</p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {projectTypes.map(({ key, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => { setFormData((p) => ({ ...p, type: key })); setErrors({}); }}
                  className={`group relative p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-center flex flex-col items-center gap-3 ${
                    formData.type === key
                      ? "border-[#D5B25D] bg-[#D5B25D]/10 shadow-[0_0_30px_rgba(213,178,93,0.2)]"
                      : isLightMode
                        ? "border-slate-200 bg-white hover:border-[#D5B25D]/50 hover:bg-slate-50 shadow-sm"
                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {formData.type === key && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={16} className="text-[#D5B25D]" />
                    </div>
                  )}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={28} style={{ color }} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm sm:text-base ${textPri}`}>{t(`calculator.${key}`)}</p>
                    <p className={`text-xs mt-1 ${textMut}`}>{t(`calculator.${key}_desc`)}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#D5B25D] hover:bg-[#E1BF67] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#D5B25D]/20 text-base cursor-pointer"
              >
                {isRtl && <ChevronLeft size={20} />}
                <span>{ui.next[lang] || ui.next['en']}</span>
                {!isRtl && <ChevronRight size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Specifications ── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Area */}
                <div className={`${cardCls} rounded-2xl p-6`}>
                  <label className="block text-[#D5B25D] font-bold text-sm mb-3">
                    {t("calculator.area")}
                  </label>
                  <input
                    type="number"
                    min="50"
                    value={formData.area}
                    onChange={(e) => { setFormData((p) => ({ ...p, area: e.target.value })); setErrors({}); }}
                    placeholder={t("calculator.areaPlaceholder")}
                    className={`w-full border rounded-xl px-4 py-3 text-lg font-bold outline-none transition-all duration-300 focus:border-[#D5B25D] ${errors.area ? "border-red-500" : isLightMode ? "border-slate-200 bg-white text-[#1e293b]" : "border-white/15 bg-black/40 text-white"}`}
                  />
                  {errors.area && <p className="text-red-400 text-xs mt-2">{t("calculator.required")}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[200, 400, 600, 1000, 2000].map((v) => (
                      <button key={v} onClick={() => setFormData((p) => ({ ...p, area: String(v) }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-200 ${formData.area === String(v) ? "bg-[#D5B25D] text-black border-[#D5B25D]" : isLightMode ? "border-slate-200 text-slate-500 hover:border-[#D5B25D]/50" : "border-white/15 text-white/60 hover:border-[#D5B25D]/50"}`}>
                        {fmt(v)} {lang === "ar" || lang === "ur" ? "م²" : "m²"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floors */}
                <div className={`${cardCls} rounded-2xl p-6`}>
                  <label className="block text-[#D5B25D] font-bold text-sm mb-3">
                    {t("calculator.floors")}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setFormData((p) => ({ ...p, floors: String(Math.max(1, Number(p.floors) - 1)) }))}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:border-[#D5B25D] hover:bg-[#D5B25D]/10 transition-all text-xl font-bold ${isLightMode ? 'border-slate-200 text-[#1e293b]' : 'border-white/20 text-white'}`}
                    >−</button>
                    <span className="text-3xl font-black text-[#D5B25D] min-w-[60px] text-center">{fmt(Number(formData.floors))}</span>
                    <button
                      onClick={() => setFormData((p) => ({ ...p, floors: String(Math.min(20, Number(p.floors) + 1)) }))}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:border-[#D5B25D] hover:bg-[#D5B25D]/10 transition-all text-xl font-bold ${isLightMode ? 'border-slate-200 text-[#1e293b]' : 'border-white/20 text-white'}`}
                    >+</button>
                  </div>
                </div>

                {/* Quality */}
                <div className={`${cardCls} rounded-2xl p-6`}>
                  <label className="block text-[#D5B25D] font-bold text-sm mb-3">
                    {t("calculator.quality")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {qualityOptions.map(({ key, color, label }) => (
                      <button key={key} onClick={() => setFormData((p) => ({ ...p, quality: key }))}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${formData.quality === key ? "border-[#D5B25D] text-[#D5B25D] bg-[#D5B25D]/10" : isLightMode ? "border-slate-200 text-slate-500 hover:border-[#D5B25D]/50" : "border-white/10 text-white/60 hover:border-white/25"}`}
                        style={formData.quality === key ? { borderColor: color, color } : {}}
                      >{label}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Location */}
                <div className={`${cardCls} rounded-2xl p-6`}>
                  <label className="block text-[#D5B25D] font-bold text-sm mb-3">
                    {t("calculator.location")}
                  </label>
                  <div className="flex flex-col gap-2">
                    {locationOptions.map(({ key, label }) => (
                      <button key={key} onClick={() => setFormData((p) => ({ ...p, location: key }))}
                        className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold text-start transition-all duration-200 ${formData.location === key ? "border-[#D5B25D] bg-[#D5B25D]/10 text-[#D5B25D]" : isLightMode ? "border-slate-200 text-slate-500 hover:border-[#D5B25D]/40" : "border-white/10 text-white/60 hover:border-white/25"}`}
                      >{label}</button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className={`${cardCls} rounded-2xl p-6`}>
                  <label className="block text-[#D5B25D] font-bold text-sm mb-3">
                    {t("calculator.extras")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {extrasOptions.map(({ key, icon: Icon, label, cost }) => {
                      const active = formData.extras.includes(key);
                      return (
                        <button key={key} onClick={() => toggleExtra(key)}
                          className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200 ${active ? "border-[#D5B25D] bg-[#D5B25D]/10 text-[#D5B25D]" : isLightMode ? "border-slate-200 text-slate-500 hover:border-[#D5B25D]/40" : "border-white/10 text-white/50 hover:border-white/25"}`}
                        >
                          <Icon size={15} />
                          <span className="truncate">{label}</span>
                          {active && <CheckCircle2 size={12} className="ms-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(1)}
                className={`flex items-center gap-2 px-6 py-3 border font-bold rounded-xl transition-all duration-300 text-sm ${isLightMode ? 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-[#1e293b]' : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'}`}>
                {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                <span>{ui.back[lang] || ui.back['en']}</span>
              </button>
              <button onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#D5B25D] hover:bg-[#E1BF67] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#D5B25D]/20 text-base">
                <Calculator size={18} />
                {t("calculator.calculate")}
              </button>
            </div>
          </div>
        )}

        {/* ── Calculating Loader ── */}
        {calculating && (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-[#D5B25D]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D5B25D] animate-spin" />
              <div className="absolute inset-4 rounded-full bg-[#D5B25D]/10 flex items-center justify-center">
                <Calculator size={28} className="text-[#D5B25D] animate-pulse" />
              </div>
            </div>
            <p className="text-[#D5B25D] font-bold text-xl">{t("calculator.calculating")}</p>
            <p className={`text-sm mt-2 ${textMut}`}>{ui.processing[lang] || ui.processing['en']}</p>
            {/* Animated dots */}
            <div className="flex gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#D5B25D]"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Results ── */}
        {step === 3 && result && !calculating && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

            {/* Main Cost Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Min */}
              <div className={`${cardCls} rounded-2xl p-6 text-center`}>
                <p className={`text-xs font-semibold mb-2 ${textMut}`}>{t("calculator.min_cost")}</p>
                <p className={`text-2xl font-black ${textPri}`}>{fmt(result.min)}</p>
                <p className={`text-xs mt-1 ${textMut}`}>{t("calculator.currency")}</p>
              </div>
              {/* Avg — highlighted */}
              <div className="relative bg-gradient-to-br from-[#D5B25D]/20 to-[#B8923A]/10 border-2 border-[#D5B25D] rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(213,178,93,0.2)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D5B25D] text-black text-[10px] font-black px-3 py-1 rounded-full">{t("calculator.avg_cost")}</span>
                </div>
                <p className="text-3xl font-black text-[#D5B25D] mt-2">{fmt(result.avg)}</p>
                <p className="text-[#D5B25D]/60 text-xs mt-1">{t("calculator.currency")}</p>
              </div>
              {/* Max */}
              <div className={`${cardCls} rounded-2xl p-6 text-center`}>
                <p className={`text-xs font-semibold mb-2 ${textMut}`}>{t("calculator.max_cost")}</p>
                <p className={`text-2xl font-black ${textPri}`}>{fmt(result.max)}</p>
                <p className={`text-xs mt-1 ${textMut}`}>{t("calculator.currency")}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`${cardCls} rounded-2xl p-5 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-[#D5B25D]/15 border border-[#D5B25D]/30 flex items-center justify-center">
                  <TrendingUp size={22} className="text-[#D5B25D]" />
                </div>
                <div>
                  <p className={`text-xs ${textMut}`}>{t("calculator.cost_per_sqm")}</p>
                  <p className={`font-black text-lg ${textPri}`}>{fmt(result.costPerSqm)} <span className={`text-xs ${textMut}`}>{t("calculator.currency")}</span></p>
                </div>
              </div>
              <div className={`${cardCls} rounded-2xl p-5 flex items-center gap-4`}>
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <Clock size={22} className="text-blue-400" />
                </div>
                <div>
                  <p className={`text-xs ${textMut}`}>{t("calculator.timeline")}</p>
                  <p className={`font-black text-lg ${textPri}`}>{fmt(result.timeline)} <span className={`text-xs ${textMut}`}>{t("calculator.months")}</span></p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className={`${cardCls} rounded-2xl p-6`}>
              <h3 className={`font-black text-lg mb-5 flex items-center gap-2 ${textPri}`}>
                <Zap size={18} className="text-[#D5B25D]" />
                {t("calculator.breakdown")}
              </h3>
              <div className="space-y-4">
                {breakdownKeys.map((key, i) => {
                  const value = result.breakdown[key];
                  const pct = Math.round((value / result.avg) * 100);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm ${textSec}`}>{t(`calculator.${key}`)}</span>
                        <span className={`font-bold text-sm ${textPri}`}>{fmt(value)} <span className={`text-xs ${textMut}`}>{t("calculator.currency")}</span></span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isLightMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%`, background: breakdownColors[i] }}
                        />
                      </div>
                    </div>
                  );
                })}
                {result.breakdown.extras > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm ${textSec}`}>{t("calculator.extras")}</span>
                      <span className={`font-bold text-sm ${textPri}`}>{fmt(result.breakdown.extras)} <span className={`text-xs ${textMut}`}>{t("calculator.currency")}</span></span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isLightMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round((result.breakdown.extras / result.avg) * 100)}%`, background: "#e879f9" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Engineering Insights */}
            <div className="bg-gradient-to-br from-[#D5B25D]/10 to-transparent border border-[#D5B25D]/20 rounded-2xl p-6">
              <h3 className="text-[#D5B25D] font-black text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={18} />
                {t("calculator.aiInsights")}
              </h3>
              <div className="space-y-3">
                {result.insights.map((insight, i) => (
                  <div key={i} className={`flex gap-3 text-sm leading-relaxed ${textSec}`}>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <p className="text-amber-500 font-bold text-sm mb-1">⚠ {t("calculator.note")}</p>
              <p className={`text-xs leading-relaxed ${isLightMode ? 'text-amber-700/70' : 'text-amber-300/60'}`}>{t("calculator.noteText")}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#D5B25D] hover:bg-[#E1BF67] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#D5B25D]/20 text-base">
                <Phone size={18} />
                {t("calculator.contact_cta")}
              </Link>
              <button onClick={reset}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 font-bold rounded-xl transition-all duration-300 text-base ${isLightMode ? 'border-slate-200 text-slate-600 hover:border-slate-400' : 'border-white/20 text-white hover:border-white/40'}`}>
                <RotateCcw size={18} />
                {t("calculator.reset")}
              </button>
            </div>

            {/* Back link */}
            <div className="text-center pt-2">
              <Link href="/" className={`inline-flex items-center gap-2 text-sm transition-colors ${isLightMode ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white/70'}`}>
                <ArrowLeft size={14} className={isRtl ? "rotate-180" : ""} />
                <span>{ui.backToHome[lang] || ui.backToHome['en']}</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* bounce keyframe via style tag */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        .animate-in { animation: fadeSlideIn 0.5s ease-out; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
