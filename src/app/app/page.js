"use client";

import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { BarChart3, MessageCircle, FileText, Bell } from "lucide-react";

/* ─── Translations ─────────────────────────────────────────── */
const C = {
  ar: {
    badge: "تطبيق الجوال",
    title1: "حمّل تطبيق",
    title2: "MNC",
    desc: "تابع مشاريعك، تواصل مع فريقك، واستعرض وثائقك في أي وقت ومن أي مكان.",
    soon: "قريباً",
    featuresBadge: "لماذا التطبيق؟",
    featuresTitle: "كل شيء في جيبك",
    features: [
      { icon: BarChart3, title: "متابعة المشاريع",  desc: "تتبّع نسب الإنجاز لحظةً بلحظة مع تقارير مرئية دقيقة." },
      { icon: MessageCircle, title: "التواصل المباشر", desc: "تحدّث مع فريق MNC الهندسي مباشرةً دون انتظار." },
      { icon: FileText, title: "عرض المستندات",     desc: "استعرض العقود والمخططات والتقارير من هاتفك فوراً." },
      { icon: Bell, title: "إشعارات فورية",        desc: "احصل على تنبيهات آنية لكل تحديث في مشروعك." },
    ],
    ctaBadge: "ابدأ الآن",
    ctaTitle: "جاهز لتجربة تطبيق MNC؟",
    ctaDesc: "حمّل التطبيق الآن وابدأ إدارة مشاريعك باحترافية عالية.",
  },
  en: {
    badge: "Mobile App",
    title1: "Download",
    title2: "MNC App",
    desc: "Track your projects, communicate with your team, and access your documents anytime, anywhere.",
    soon: "Coming Soon",
    featuresBadge: "Why the App?",
    featuresTitle: "Everything in Your Pocket",
    features: [
      { icon: BarChart3, title: "Project Tracking",        desc: "Monitor progress in real-time with precise visual reports." },
      { icon: MessageCircle, title: "Direct Communication", desc: "Talk directly with the MNC engineering team without waiting." },
      { icon: FileText, title: "Document Viewer",          desc: "Access contracts, blueprints, and reports instantly from your phone." },
      { icon: Bell, title: "Instant Notifications",        desc: "Get real-time alerts for every update in your project." },
    ],
    ctaBadge: "Get Started",
    ctaTitle: "Ready to experience MNC App?",
    ctaDesc: "Download the app now and start managing your projects professionally.",
  },
};

const FEAT_COLORS = ["#C9A34D", "#60a5fa", "#34d399", "#f472b6"];

/* ─── Apple Icon ───────────────────────────────────────────── */
function AppleIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/* ─── Google Play Icon ─────────────────────────────────────── */
function PlayIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M3.18 23.76a2.5 2.5 0 0 1-1.18-2.2V2.44a2.5 2.5 0 0 1 1.18-2.2l11.67 11.76L3.18 23.76zm13.25-7.5L4.02 23.5l10.42-5.88 2-1.36zM21.6 10.9l-2.9-1.64-2.24 2.26 2.24 2.26 2.92-1.65c.83-.47.83-1.76-.02-2.23zm-6.19 3.14L4.02.5l12.42 7.24-1.03 6.3z" />
    </svg>
  );
}

/* ─── iPhone Mockup ────────────────────────────────────────── */
function IPhoneMockup() {
  return (
    <div style={{ position: "relative", width: 168, height: 346 }}>
      {/* Frame */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: 48,
        background: "linear-gradient(145deg,#f0f0f0 0%,#d0d0d0 45%,#e4e4e4 70%,#b8b8b8 100%)",
        boxShadow: "0 0 0 1.5px rgba(255,255,255,0.55) inset, 0 28px 80px rgba(0,0,0,0.75), 0 4px 18px rgba(201,163,77,0.12)",
        padding: 5,
      }}>
        {/* Silent switch */}
        <div style={{ position:"absolute", left:-4, top:60, width:4, height:22, background:"#b4b4b4", borderRadius:"3px 0 0 3px" }} />
        {/* Volume up */}
        <div style={{ position:"absolute", left:-4, top:92, width:4, height:32, background:"#b4b4b4", borderRadius:"3px 0 0 3px" }} />
        {/* Volume down */}
        <div style={{ position:"absolute", left:-4, top:134, width:4, height:32, background:"#b4b4b4", borderRadius:"3px 0 0 3px" }} />
        {/* Power */}
        <div style={{ position:"absolute", right:-4, top:104, width:4, height:52, background:"#b4b4b4", borderRadius:"0 3px 3px 0" }} />

        {/* Screen */}
        <div style={{
          borderRadius: 43, overflow:"hidden", width:"100%", height:"100%",
          background:"#0D1B2A", display:"flex", flexDirection:"column",
        }}>
          {/* Dynamic Island */}
          <div style={{ display:"flex", justifyContent:"center", paddingTop:14, paddingBottom:2 }}>
            <div style={{ width:90, height:30, background:"#000", borderRadius:20 }} />
          </div>
          {/* Status bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"2px 16px 6px" }}>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:10, fontWeight:700 }}>9:41</span>
            <div style={{ display:"flex", gap:3, alignItems:"center" }}>
              {[3,5,7,9].map((h,i) => (
                <div key={i} style={{ width:3, height:h, background: i<3?"#C9A34D":"rgba(255,255,255,0.3)", borderRadius:1, alignSelf:"flex-end" }} />
              ))}
              <div style={{ width:18, height:9, border:"1.5px solid rgba(255,255,255,0.45)", borderRadius:3, overflow:"hidden", marginLeft:4 }}>
                <div style={{ width:"70%", height:"100%", background:"#4ade80" }} />
              </div>
            </div>
          </div>

          {/* App content */}
          <div style={{ flex:1, padding:"6px 14px 4px", display:"flex", flexDirection:"column", gap:8, direction:"rtl" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:38, height:38, borderRadius:11,
                background:"rgba(201,163,77,0.15)", border:"1px solid rgba(201,163,77,0.35)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>
                <span style={{ color:"#C9A34D", fontWeight:900, fontSize:15 }}>M</span>
              </div>
              <div>
                <div style={{ color:"#C9A34D", fontSize:11, fontWeight:900, letterSpacing:2 }}>MNC</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:8 }}>مشاريعي</div>
              </div>
              <div style={{ marginRight:"auto" }}>
                <div style={{ width:22, height:22, borderRadius:11, background:"rgba(201,163,77,0.12)", border:"1px solid rgba(201,163,77,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ width:6, height:6, borderRadius:3, background:"#C9A34D" }} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"flex", gap:6 }}>
              {[{l:"المشاريع",v:"12",c:"#C9A34D"},{l:"منجزة",v:"9",c:"#4ade80"}].map((s,i)=>(
                <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"7px 9px" }}>
                  <div style={{ color:s.c, fontSize:18, fontWeight:900 }}>{s.v}</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:7 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:8, fontWeight:700 }}>التقدم</div>
              {[{n:"BARJIS",p:75,c:"#C9A34D"},{n:"مشروع A",p:52,c:"rgba(255,255,255,0.5)"},{n:"مشروع B",p:88,c:"#60a5fa"}].map((item,i)=>(
                <div key={i}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ color:"rgba(255,255,255,0.55)", fontSize:7 }}>{item.n}</span>
                    <span style={{ color:item.c, fontSize:7, fontWeight:700 }}>{item.p}%</span>
                  </div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width:`${item.p}%`, height:"100%", background:item.c, borderRadius:2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Notification card */}
            <div style={{ background:"rgba(201,163,77,0.08)", border:"1px solid rgba(201,163,77,0.2)", borderRadius:10, padding:"8px 10px", display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:20, height:20, borderRadius:6, background:"rgba(201,163,77,0.22)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#C9A34D", fontSize:10, fontWeight:900 }}>!</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ height:6, width:"80%", background:"rgba(255,255,255,0.22)", borderRadius:3, marginBottom:4 }} />
                <div style={{ height:4, width:"55%", background:"rgba(255,255,255,0.1)", borderRadius:2 }} />
              </div>
            </div>
          </div>

          {/* Home indicator */}
          <div style={{ display:"flex", justifyContent:"center", paddingBottom:9, paddingTop:4 }}>
            <div style={{ width:80, height:4, background:"rgba(255,255,255,0.3)", borderRadius:2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Android Mockup ───────────────────────────────────────── */
function AndroidMockup() {
  return (
    <div style={{ position:"relative", width:152, height:316 }}>
      {/* Frame */}
      <div style={{
        position:"absolute", inset:0,
        borderRadius:32,
        background:"linear-gradient(145deg,#2c2c2c 0%,#1a1a1a 55%,#242424 100%)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.05) inset, 0 22px 70px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.6)",
        padding:5,
      }}>
        {/* Volume */}
        <div style={{ position:"absolute", left:-3, top:80, width:3, height:58, background:"#181818", borderRadius:"3px 0 0 3px" }} />
        {/* Power */}
        <div style={{ position:"absolute", right:-3, top:100, width:3, height:40, background:"#181818", borderRadius:"0 3px 3px 0" }} />

        {/* Screen */}
        <div style={{
          borderRadius:27, overflow:"hidden", width:"100%", height:"100%",
          background:"#0D1B2A", display:"flex", flexDirection:"column",
        }}>
          {/* Status bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px 5px", position:"relative" }}>
            <span style={{ color:"rgba(255,255,255,0.55)", fontSize:9, fontWeight:700 }}>9:41</span>
            {/* Punch-hole */}
            <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:13, height:13, background:"#000", borderRadius:7 }} />
            <div style={{ width:15, height:8, border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:"65%", height:"100%", background:"#4ade80" }} />
            </div>
          </div>

          {/* App content */}
          <div style={{ flex:1, padding:"4px 12px 4px", display:"flex", flexDirection:"column", gap:7, direction:"rtl" }}>
            {/* Greeting card */}
            <div style={{ background:"linear-gradient(135deg,rgba(201,163,77,0.13) 0%,rgba(13,27,42,0.4) 100%)", border:"1px solid rgba(201,163,77,0.2)", borderRadius:12, padding:"10px 13px" }}>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:8, marginBottom:3 }}>مرحباً</div>
              <div style={{ color:"#C9A34D", fontSize:14, fontWeight:900, letterSpacing:1 }}>MNC</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:7, marginTop:3 }}>٣ إشعارات جديدة</div>
            </div>

            {/* Quick actions grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[
                { l:"المشاريع", active:true },
                { l:"التقارير", active:false },
                { l:"التواصل", active:false },
                { l:"المستندات", active:false },
              ].map((a,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${a.active?"rgba(201,163,77,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:10, padding:"8px 9px", display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:8, height:8, borderRadius:4, background: a.active?"#C9A34D":"rgba(255,255,255,0.2)", flexShrink:0 }} />
                  <span style={{ color: a.active?"#C9A34D":"rgba(255,255,255,0.5)", fontSize:7, fontWeight:600 }}>{a.l}</span>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:7, fontWeight:700 }}>النشاط الأخير</div>
              {[
                { t:"تحديث BARJIS", time:"منذ ٢ د", c:"#C9A34D" },
                { t:"مستند جديد",   time:"منذ ١٥ د", c:"rgba(255,255,255,0.35)" },
              ].map((a,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"5px 8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:a.c }} />
                    <span style={{ color:"rgba(255,255,255,0.55)", fontSize:7 }}>{a.t}</span>
                  </div>
                  <span style={{ color:"rgba(255,255,255,0.28)", fontSize:6 }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gesture bar */}
          <div style={{ display:"flex", justifyContent:"center", paddingBottom:10, paddingTop:4 }}>
            <div style={{ width:85, height:3, background:"rgba(255,255,255,0.22)", borderRadius:2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Download Button ──────────────────────────────────────── */
function DownloadBtn({ Icon, label, size = "md", gold = false }) {
  const sizeClasses = size === "lg"
    ? "px-8 py-4 rounded-2xl gap-4"
    : "px-6 py-3.5 rounded-xl gap-3";
  const base = gold
    ? "bg-[#C9A34D] text-black hover:bg-[#d4b455] shadow-[0_4px_20px_rgba(201,163,77,0.3)] hover:shadow-[0_8px_30px_rgba(201,163,77,0.45)]"
    : "bg-white/8 text-white border border-white/15 hover:bg-white/14 hover:border-white/25";
  return (
    <button className={`flex items-center ${sizeClasses} ${base} font-bold transition-all duration-300 active:scale-95`}>
      <Icon size={size === "lg" ? 26 : 22} />
      <div className="text-start leading-none">
        <div className={`${size === "lg" ? "text-[10px]" : "text-[9px]"} opacity-55 uppercase tracking-widest mb-0.5`}>{label.soon}</div>
        <div className={`${size === "lg" ? "text-base" : "text-sm"} font-black`}>{label.name}</div>
      </div>
    </button>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function AppPage() {
  const { lang, isRTL } = useLanguage();
  const isAr = lang === "ar" || lang === "ur";
  const c = C[isAr ? "ar" : "en"];
  const ta = isRTL ? "text-right" : "text-left";

  return (
    <main className="min-h-screen bg-[#0D1B2A] font-cairo overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* ═══ HERO ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#C9A34D]/6 blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#0a2540]/60 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage:"linear-gradient(rgba(201,163,77,1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,163,77,1) 1px,transparent 1px)", backgroundSize:"70px 70px" }}
          />
          {/* Top gold line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A34D]/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-6 max-w-7xl">
          {/* Always LTR layout so phones stay on the right visually */}
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-10 xl:gap-16" style={{ direction:"ltr" }}>

            {/* ── Text ── */}
            <div className={`flex-1 w-full ${ta}`} dir={isRTL ? "rtl" : "ltr"}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-[#C9A34D]/30 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
                <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.18em] uppercase">{c.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] mb-6">
                {c.title1}{" "}
                <span className="text-[#C9A34D] relative">
                  {c.title2}
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A34D] to-[#C9A34D]/30 rounded-full" />
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/55 text-lg leading-relaxed max-w-[430px] mb-10">{c.desc}</p>

              {/* Buttons */}
              <div className={`flex flex-wrap gap-4 ${isRTL ? "justify-end lg:justify-start" : ""}`}>
                <DownloadBtn Icon={AppleIcon}  label={{ soon: c.soon, name: "App Store"    }} />
                <DownloadBtn Icon={PlayIcon}   label={{ soon: c.soon, name: "Google Play"  }} />
              </div>

              {/* Rating row */}
              <div className={`flex items-center gap-3 mt-8 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <div className="flex">
                  {[...Array(5)].map((_,i) => (
                    <svg key={i} viewBox="0 0 16 16" width="16" height="16" className="text-[#C9A34D]" fill="currentColor">
                      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/40 text-sm">{isAr ? "٤.٩ تقييم التطبيق" : "4.9 App Rating"}</span>
              </div>
            </div>

            {/* ── Phone Mockups ── */}
            <div className="relative flex-shrink-0 flex items-end justify-center" style={{ width:360, height:400 }}>
              {/* Glow behind phones */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[280px] h-[280px] rounded-full bg-[#C9A34D]/12 blur-3xl" />
              </div>
              {/* Android — behind, left */}
              <div className="absolute" style={{ bottom:0, left:4, zIndex:1, opacity:0.92 }}>
                <AndroidMockup />
              </div>
              {/* iPhone — front, right, elevated */}
              <div className="absolute" style={{ bottom:24, right:4, zIndex:2 }}>
                <IPhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A] via-[#091320] to-[#0D1B2A] pointer-events-none" />
        <div className="relative container mx-auto px-6 max-w-7xl">

          {/* Heading */}
          <div className={`${ta} mb-16`}>
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-[#C9A34D]/25 rounded-full px-5 py-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
              <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.18em] uppercase">{c.featuresBadge}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">{c.featuresTitle}</h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.features.map((feat, i) => {
              const Icon = feat.icon;
              const color = FEAT_COLORS[i];
              return (
                <div
                  key={i}
                  className="group relative bg-white/[0.03] border border-white/[0.07] rounded-3xl p-7 hover:border-[#C9A34D]/30 hover:bg-white/[0.055] transition-all duration-400 hover:-translate-y-2"
                  data-aos="fade-up" data-aos-delay={i * 80}
                >
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, ${color}18, transparent 70%)` }}
                  />
                  {/* Icon */}
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6"
                    style={{ width:52, height:52, background:`${color}15`, border:`1px solid ${color}30` }}
                  >
                    <Icon size={24} style={{ color }} />
                  </div>
                  <h3 className={`text-white font-black text-[17px] mb-3 ${ta}`}>{feat.title}</h3>
                  <p className={`text-white/45 text-sm leading-relaxed ${ta}`}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ DOWNLOAD CTA ════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div
            className="relative rounded-[2rem] overflow-hidden border border-[#C9A34D]/20"
            style={{ background:"linear-gradient(135deg,#091320 0%,#0D1B2A 50%,#0f2035 100%)" }}
          >
            {/* Glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A34D]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#0a2540]/50 rounded-full blur-[60px] pointer-events-none" />
            {/* Gold accent line top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A34D]/50 to-transparent" />

            <div className="relative z-10 text-center py-20 px-8">
              <div className="inline-flex items-center gap-2.5 bg-[#C9A34D]/10 border border-[#C9A34D]/25 rounded-full px-5 py-2 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A34D] animate-pulse block" />
                <span className="text-[#C9A34D] text-[11px] font-bold tracking-[0.18em] uppercase">{c.ctaBadge}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">{c.ctaTitle}</h2>
              <p className="text-white/50 text-lg max-w-lg mx-auto mb-12 leading-relaxed">{c.ctaDesc}</p>

              <div className="flex flex-wrap gap-5 justify-center">
                <DownloadBtn Icon={AppleIcon} label={{ soon: c.soon, name: "App Store"   }} size="lg" gold />
                <DownloadBtn Icon={PlayIcon}  label={{ soon: c.soon, name: "Google Play" }} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
