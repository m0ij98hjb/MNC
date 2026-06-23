"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useMusic } from "@/context/MusicContext";
import {
  Hammer, Layers, Building2, Zap, Sparkles, CheckCircle,
  Play, Pause, Maximize,
} from "lucide-react";

const STAGES = [
  {
    id: 1,
    Icon: Hammer,
    titleAr: "تمهيد الأرض والحفر",
    titleEn: "Site Prep & Excavation",
    descAr: "دراسة التربة وتخطيط الموقع الهندسي وحفر الأساسات بدقة عالية",
    descEn: "Soil analysis, engineering site planning, and precision foundation excavation",
    tagsAr: ["دراسة التربة", "مخططات الأساسات", "أعمال الحفر"],
    tagsEn: ["Soil Analysis", "Foundation Plans", "Excavation Works"],
    floorsTo: 1,
  },
  {
    id: 2,
    Icon: Layers,
    titleAr: "الخرسانة والهيكل الإنشائي",
    titleEn: "Concrete & Structural Frame",
    descAr: "صب الأساسات وإقامة الأعمدة والأسقف الخرسانية المسلحة طابقاً بطابق",
    descEn: "Foundation pour, reinforced concrete columns and slabs floor by floor",
    tagsAr: ["صب الأساسات", "الأعمدة والأسقف", "الهيكل الكامل"],
    tagsEn: ["Foundation Pour", "Columns & Slabs", "Full Skeleton"],
    floorsTo: 4,
  },
  {
    id: 3,
    Icon: Building2,
    titleAr: "الجدران والواجهات الخارجية",
    titleEn: "Walls & Exterior Facades",
    descAr: "رفع جدران الطوب وتركيب النوافذ والأبواب وتكسية الواجهات الخارجية",
    descEn: "Masonry walls, window and door installation, and exterior cladding",
    tagsAr: ["جدران الطوب", "النوافذ والأبواب", "الواجهات"],
    tagsEn: ["Masonry", "Windows & Doors", "Exterior Cladding"],
    floorsTo: 6,
  },
  {
    id: 4,
    Icon: Zap,
    titleAr: "الأعمال الميكانيكية والكهربائية",
    titleEn: "MEP Works",
    descAr: "تمديدات الكهرباء والسباكة وأنظمة التكييف والإنذار وأنظمة الأمان",
    descEn: "Electrical, plumbing, HVAC, fire alarm, and security systems",
    tagsAr: ["تمديدات الكهرباء", "شبكة السباكة", "التكييف والأمان"],
    tagsEn: ["Electrical Works", "Plumbing Network", "HVAC & Safety"],
    floorsTo: 8,
  },
  {
    id: 5,
    Icon: Sparkles,
    titleAr: "التشطيبات والتسليم",
    titleEn: "Finishing & Handover",
    descAr: "الدهانات والأرضيات والديكور الداخلي والتشطيبات الخارجية ثم تسليم المفتاح",
    descEn: "Paint, flooring, interior decor, exterior finishing, and key handover",
    tagsAr: ["الدهانات والأرضيات", "الديكور الداخلي", "تسليم المشروع"],
    tagsEn: ["Paint & Flooring", "Interior Decor", "Key Handover"],
    floorsTo: 10,
  },
];

const TOTAL_FLOORS = 10;

/* ── Video Player ── */
function VideoPlayer() {
  const videoRef          = useRef(null);
  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [started,  setStarted]  = useState(false);
  const [progress, setProgress] = useState(0);
  const { pauseMusicForVoice, resumeMusicAfterVoice } = useMusic();

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setStarted(true);
      pauseMusicForVoice();
    } else {
      v.pause();
      setPlaying(false);
      resumeMusicAfterVoice();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen)            v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  return (
    <div className="relative w-full h-full">
      {/* Outer glow ring */}
      <div className="absolute -inset-[1px] rounded-[22px] bg-gradient-to-br from-[#D5B25D]/40 via-transparent to-[#D5B25D]/20 z-0" />

      {/* Card */}
      <div
        className="relative rounded-[20px] overflow-hidden bg-[#060E1A] z-10 cursor-pointer group h-full flex flex-col"
        onClick={togglePlay}
      >
        {/* Video */}
        <div className="relative flex-1 min-h-0">
          <video
            ref={videoRef}
            src="/assets/video/MNC-videos.mp4"
            className="w-full h-full object-cover block"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => { setPlaying(false); setProgress(0); resumeMusicAfterVoice(); }}
          />

          {/* Overlay */}
          <div className={`absolute inset-0 bg-black/45 transition-opacity duration-500 ${playing ? "opacity-0 group-hover:opacity-20" : "opacity-100"}`} />

          {/* Play button */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#D5B25D]/20 animate-ping" />
                <div className="absolute -inset-3 rounded-full bg-[#D5B25D]/10 animate-pulse" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#D5B25D] to-[#E8C96A] flex items-center justify-center shadow-[0_0_40px_rgba(213,178,93,0.55)] hover:scale-110 transition-transform duration-300">
                  <Play className="text-black fill-black" size={26} style={{ marginLeft: 3 }} />
                </div>
              </div>
            </div>
          )}

          {/* Pause hint */}
          {playing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Pause size={18} className="text-white" />
              </div>
            </div>
          )}

          {/* Company badge */}
          {!started && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#D5B25D]/25 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D5B25D] animate-pulse" />
              <span className="text-white text-[10px] font-bold">شركة ام ان سى للانشاءات</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
          {/* Progress */}
          <div className="w-full h-1 bg-white/20 rounded-full mb-2.5 cursor-pointer overflow-hidden" onClick={handleSeek}>
            <div className="h-full bg-gradient-to-r from-[#D5B25D] to-[#E8C96A] rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D5B25D]/30 border border-white/15 flex items-center justify-center transition-all">
                {playing ? <Pause size={12} className="text-white" /> : <Play size={12} className="text-white fill-white" style={{ marginLeft: 1 }} />}
              </button>
            </div>
            <button onClick={handleFullscreen} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D5B25D]/30 border border-white/15 flex items-center justify-center transition-all">
              <Maximize size={11} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3  w-5 h-5 border-t-2 border-l-2 border-[#D5B25D]/60 rounded-tl-lg z-20 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D5B25D]/60 rounded-tr-lg z-20 pointer-events-none" />
      <div className="absolute bottom-3 left-3  w-5 h-5 border-b-2 border-l-2 border-[#D5B25D]/60 rounded-bl-lg z-20 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D5B25D]/60 rounded-br-lg z-20 pointer-events-none" />
    </div>
  );
}

/* ── Main Section ── */
export default function BuildingJourney() {
  const { lang, isRTL }   = useLanguage();
  const sectionRef        = useRef(null);
  const isInView          = useInView(sectionRef, { once: true, amount: 0.25 });
  const [builtFloors, setBuiltFloors] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const isAr = lang === "ar";

  /* ── Auto-build animation ── */
  useEffect(() => {
    if (!isInView) return;
    let cancelled = false;
    let stageIdx  = 0;

    function buildNextStage() {
      if (cancelled || stageIdx >= STAGES.length) return;
      const stage = STAGES[stageIdx];
      setActiveStage(stageIdx);
      const prevFloors = stageIdx === 0 ? 0 : STAGES[stageIdx - 1].floorsTo;
      let cur = prevFloors;
      const iv = setInterval(() => {
        if (cancelled) { clearInterval(iv); return; }
        cur++;
        setBuiltFloors(cur);
        if (cur >= stage.floorsTo) {
          clearInterval(iv);
          stageIdx++;
          setTimeout(buildNextStage, 700);
        }
      }, 220);
    }

    const t = setTimeout(buildNextStage, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [isInView]);

  const isDone = builtFloors >= TOTAL_FLOORS;

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#04090F] relative overflow-hidden">
      {/* bg texture */}
      <div className="absolute inset-0 opacity-[0.022]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg,#D5B25D 0px,#D5B25D 1px,transparent 1px,transparent 80px)" }}
      />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D5B25D] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D5B25D] to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[600px] bg-[#D5B25D]/5 rounded-full blur-[180px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#D5B25D]" />
            <span className="text-[#D5B25D] text-xs font-black uppercase tracking-[0.25em]">
              {isAr ? "رحلة التشييد" : "Construction Journey"}
            </span>
            <span className="h-px w-10 bg-[#D5B25D]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading mb-5 leading-tight">
            {isAr
              ? <>من <span className="text-[#D5B25D]">الأرض</span> إلى <span className="text-[#D5B25D]">القمة</span></>
              : <>From <span className="text-[#D5B25D]">Ground</span> to <span className="text-[#D5B25D]">Top</span></>}
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "شاهد فيديو الشركة واكتشف رحلتنا من الأساس حتى التشطيب بأعلى معايير الجودة"
              : "Watch our company video and discover our journey from foundation to finishing"}
          </p>
        </motion.div>

        {/* ── Main row: Video (left) + Stages (right) ── */}
        <div className={`flex flex-col lg:flex-row gap-10 lg:gap-14 items-start ${isRTL ? "lg:flex-row-reverse" : ""}`}>

          {/* Video — sticky so it doesn't move while stages animate */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-[50%] w-full min-h-[320px] sm:min-h-[400px] lg:h-[580px] lg:sticky lg:top-28 lg:self-start"
          >
            <VideoPlayer />
          </motion.div>

          {/* Stages — right */}
          <div className="lg:w-[50%] flex flex-col gap-3">
            {STAGES.map((stage, i) => {
              const { Icon }   = stage;
              const isActive   = activeStage === i;
              const isDoneStep = activeStage > i || isDone;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.1 + 0.4 }}
                  className={`relative flex gap-4 items-start p-4 md:p-5 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-br from-[#D5B25D]/12 to-[#D5B25D]/4 border-[#D5B25D]/40 shadow-[0_0_40px_rgba(213,178,93,0.1)]"
                      : isDoneStep
                      ? "bg-white/[0.03] border-[#D5B25D]/15"
                      : "bg-white/[0.015] border-white/5"
                  }`}
                >
                  {/* Side bar */}
                  {isActive && (
                    <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-1 h-full bg-gradient-to-b from-[#D5B25D] to-[#E8C96A] rounded-full`} />
                  )}

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive
                      ? "bg-[#D5B25D] shadow-[0_0_22px_rgba(213,178,93,0.45)]"
                      : isDoneStep
                      ? "bg-[#D5B25D]/20 border border-[#D5B25D]/30"
                      : "bg-white/[0.04] border border-white/8"
                  }`}>
                    {isDoneStep && !isActive
                      ? <CheckCircle size={18} className="text-[#D5B25D]" />
                      : <Icon size={18} className={isActive ? "text-black" : "text-white/25"} />
                    }
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-2 mb-0.5 flex-wrap ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <span className={`text-[10px] font-black tracking-[0.2em] ${isActive || isDoneStep ? "text-[#D5B25D]" : "text-white/20"}`}>
                        0{stage.id}
                      </span>
                      {isDoneStep && !isActive && (
                        <span className="text-[9px] bg-[#D5B25D]/12 text-[#D5B25D] px-2 py-0.5 rounded-full font-black">✓ {isAr ? "مكتمل" : "Done"}</span>
                      )}
                      {isActive && (
                        <span className="text-[9px] bg-[#D5B25D] text-black px-2 py-0.5 rounded-full font-black animate-pulse">
                          {isAr ? "جارٍ الآن" : "In Progress"}
                        </span>
                      )}
                    </div>

                    <h3 className={`font-black text-sm md:text-base leading-tight mb-1 transition-colors duration-300 ${
                      isActive ? "text-white" : isDoneStep ? "text-white/60" : "text-white/25"
                    }`}>
                      {isAr ? stage.titleAr : stage.titleEn}
                    </h3>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-2">
                          {isAr ? stage.descAr : stage.descEn}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(isAr ? stage.tagsAr : stage.tagsEn).map((tag, j) => (
                            <motion.span
                              key={j}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: j * 0.08 }}
                              className="text-[9px] bg-[#D5B25D]/10 border border-[#D5B25D]/25 text-[#D5B25D] px-2.5 py-1 rounded-full font-bold"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Progress bar */}
            <div className="mt-1 px-1">
              <div className="flex justify-between text-[9px] font-bold text-white/25 mb-1">
                <span>{isAr ? "التقدم الإجمالي" : "Overall Progress"}</span>
                <span className="text-[#D5B25D]">{Math.round((builtFloors / TOTAL_FLOORS) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D5B25D] to-[#E8C96A] rounded-full"
                  animate={{ width: `${(builtFloors / TOTAL_FLOORS) * 100}%` }}
                  transition={{ duration: 0.28 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Done message */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#D5B25D]/15 via-[#D5B25D]/8 to-[#D5B25D]/15 border border-[#D5B25D]/30 rounded-2xl px-8 py-5 shadow-[0_0_60px_rgba(213,178,93,0.12)]">
              <Sparkles className="text-[#D5B25D]" size={20} />
              <p className="text-white font-black text-sm md:text-base">
                {isAr
                  ? "المشروع مكتمل — من الأساس إلى التشطيب بأعلى معايير الجودة"
                  : "Project Complete — From Foundation to Finishing with the highest quality standards"}
              </p>
              <Sparkles className="text-[#D5B25D]" size={20} />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
