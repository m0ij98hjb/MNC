"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Eye, Camera, QrCode, Search, ExternalLink,
  WifiOff, ChevronLeft, Loader2, RefreshCw,
} from "lucide-react";
import { projects } from "@/lib/cameraConfig";

/* ─────────────────── MJPEG feed ─────────────────── */
function MjpegFeed({ stream }) {
  const [error, setError]   = useState(false);
  const [stamp,  setStamp]  = useState(() => Date.now());

  useEffect(() => {
    setError(false);
    setStamp(Date.now());
    const iv = setInterval(() => setStamp(Date.now()), 3000);
    return () => clearInterval(iv);
  }, [stream.url]);

  const src = stream.url + (stream.url.includes("?") ? "&" : "?") + "_t=" + stamp;

  return (
    <div className="relative w-full h-full bg-[#0a1525] flex items-center justify-center overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <WifiOff size={28} className="text-red-500" />
          <p className="text-red-400 text-xs font-bold">الكاميرا غير متصلة</p>
          <button
            onClick={() => { setError(false); setStamp(Date.now()); }}
            className="mt-1 flex items-center gap-1 text-[#C9A34D] text-[10px] hover:underline"
          >
            <RefreshCw size={10} /> إعادة المحاولة
          </button>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={stream.name}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

/* ─────────────────── HLS feed ─────────────────── */
function HlsFeed({ stream }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    let hls;
    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: false });
        hls.loadSource(stream.url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError(true);
        });
      } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = stream.url;
      } else {
        setError(true);
      }
    }).catch(() => setError(true));

    return () => { if (hls) hls.destroy(); };
  }, [stream.url]);

  if (error) {
    return (
      <div className="w-full h-full bg-[#0a1525] flex flex-col items-center justify-center gap-2">
        <WifiOff size={28} className="text-red-500" />
        <p className="text-red-400 text-xs font-bold">الكاميرا غير متصلة</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover bg-black"
      autoPlay
      muted
      playsInline
      onError={() => setError(true)}
    />
  );
}

/* ─────────────────── Single camera card ─────────────────── */
function CameraCard({ stream }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#C9A34D]/20 bg-[#0D1B2A] flex flex-col" style={{ minHeight: 160 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0a1321] border-b border-[#C9A34D]/15 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-[11px] font-bold truncate max-w-[120px]">{stream.name}</span>
        </div>
        <button
          onClick={() => window.open(stream.url, "_blank", "noopener")}
          title="فتح في نافذة جديدة"
          className="text-[#C9A34D]/60 hover:text-[#C9A34D] transition-colors"
        >
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1" style={{ minHeight: 120 }}>
        {stream.type === "hls"
          ? <HlsFeed stream={stream} />
          : <MjpegFeed stream={stream} />}
      </div>
    </div>
  );
}

/* ─────────────────── QR Scanner view ─────────────────── */
function QrScanView({ onResult, onBack }) {
  const [status,  setStatus]  = useState("idle"); // idle | loading | scanning | error
  const [errMsg,  setErrMsg]  = useState("");
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  const startScanner = useCallback(async () => {
    if (startedRef.current) return;
    setStatus("loading");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      scannerRef.current = new Html5Qrcode("mnc-qr-reader");
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => { onResult(text); },
        () => {}
      );
      startedRef.current = true;
      setStatus("scanning");
    } catch (e) {
      setStatus("error");
      setErrMsg(
        e?.message?.includes("NotAllowed")
          ? "تم رفض الإذن، يرجى السماح بالوصول للكاميرا"
          : "تعذّر تشغيل الكاميرا — تأكد من الاتصال الآمن (HTTPS)"
      );
    }
  }, [onResult]);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current && startedRef.current) {
        scannerRef.current.stop().catch(() => {});
        startedRef.current = false;
      }
    };
  }, [startScanner]);

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-white/60 text-sm text-center">
        وجّه الكاميرا نحو الباركود أو QR Code الخاص بالمشروع
      </p>

      {/* Scanner container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A34D]/40 w-full max-w-xs aspect-square bg-black flex items-center justify-center">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-black/70">
            <Loader2 size={32} className="text-[#C9A34D] animate-spin" />
            <span className="text-white/60 text-xs">جاري تشغيل الكاميرا...</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <WifiOff size={28} className="text-red-500" />
            <p className="text-red-400 text-sm font-bold">{errMsg}</p>
          </div>
        )}
        {/* QR reader target */}
        <div id="mnc-qr-reader" className="w-full h-full" />

        {/* Corner guides */}
        {status === "scanning" && (
          <>
            <div className="absolute top-4 left-4   w-6 h-6 border-t-2 border-l-2 border-[#C9A34D] rounded-tl pointer-events-none" />
            <div className="absolute top-4 right-4  w-6 h-6 border-t-2 border-r-2 border-[#C9A34D] rounded-tr pointer-events-none" />
            <div className="absolute bottom-4 left-4  w-6 h-6 border-b-2 border-l-2 border-[#C9A34D] rounded-bl pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C9A34D] rounded-br pointer-events-none" />
          </>
        )}
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-[#C9A34D]/70 hover:text-[#C9A34D] text-sm transition-colors">
        <ChevronLeft size={16} /> رجوع
      </button>
    </div>
  );
}

/* ─────────────────── Main Modal ─────────────────── */
export default function CameraModal({ onClose }) {
  // view: 'entry' | 'scan' | 'cameras' | 'direct'
  const [view,        setView]       = useState("entry");
  const [inputId,     setInputId]    = useState("");
  const [projectData, setProjectData] = useState(null);  // { projectName, streams }
  const [directUrl,   setDirectUrl]  = useState("");
  const [inputErr,    setInputErr]   = useState("");

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  /* Handle a scanned or typed value */
  const resolveInput = useCallback((value) => {
    const v = value.trim();
    if (!v) { setInputErr("أدخل رقم المشروع"); return; }

    // If it looks like a URL → open directly
    if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("rtsp://")) {
      setDirectUrl(v);
      setView("direct");
      return;
    }

    // Otherwise look up in cameraConfig
    const found = projects.find(
      (p) => p.projectId.toUpperCase() === v.toUpperCase()
    );
    if (found) {
      setProjectData(found);
      setInputErr("");
      setView("cameras");
    } else {
      setInputErr(`لم يتم العثور على مشروع بالرقم "${v}"`);
    }
  }, []);

  const handleScanResult = useCallback((text) => {
    resolveInput(text);
  }, [resolveInput]);

  /* ── Views ── */
  const renderContent = () => {
    if (view === "scan") {
      return (
        <QrScanView
          onResult={handleScanResult}
          onBack={() => setView("entry")}
        />
      );
    }

    if (view === "cameras" && projectData) {
      const cols = projectData.streams.length === 1 ? 1 : 2;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-base">{projectData.projectName}</h3>
            <button
              onClick={() => { setView("entry"); setProjectData(null); }}
              className="flex items-center gap-1 text-[#C9A34D]/70 hover:text-[#C9A34D] text-xs transition-colors"
            >
              <ChevronLeft size={14} /> تغيير المشروع
            </button>
          </div>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {projectData.streams.map((s) => (
              <CameraCard key={s.id} stream={s} />
            ))}
          </div>
        </div>
      );
    }

    if (view === "direct") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-sm truncate max-w-[200px]">{directUrl}</h3>
            <button
              onClick={() => { setView("entry"); setDirectUrl(""); }}
              className="flex items-center gap-1 text-[#C9A34D]/70 hover:text-[#C9A34D] text-xs transition-colors"
            >
              <ChevronLeft size={14} /> رجوع
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-[#C9A34D]/20" style={{ height: 380 }}>
            <iframe
              src={directUrl}
              title="كاميرا مباشرة"
              className="w-full h-full bg-black"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          <button
            onClick={() => window.open(directUrl, "_blank", "noopener")}
            className="flex items-center justify-center gap-2 text-[#C9A34D] text-xs hover:underline"
          >
            <ExternalLink size={13} /> فتح في نافذة جديدة
          </button>
        </div>
      );
    }

    /* ── Entry view ── */
    return (
      <div className="flex flex-col gap-6">
        {/* Manual input */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#C9A34D] mb-1">
            <Search size={16} />
            <span className="text-sm font-bold">إدخال رقم المشروع</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputId}
              onChange={(e) => { setInputId(e.target.value); setInputErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && resolveInput(inputId)}
              placeholder="مثال: MNC-001"
              dir="ltr"
              className="flex-1 bg-[#0a1525] border border-[#C9A34D]/25 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#C9A34D]/60 transition-colors"
            />
            <button
              onClick={() => resolveInput(inputId)}
              className="px-5 py-3 bg-gradient-to-r from-[#C9A34D] to-[#e0b85a] text-black font-black text-sm rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(201,163,77,0.35)]"
            >
              عرض
            </button>
          </div>
          {inputErr && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <WifiOff size={11} /> {inputErr}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">أو</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* QR scan button */}
        <button
          onClick={() => setView("scan")}
          className="flex flex-col items-center gap-3 py-6 border-2 border-dashed border-[#C9A34D]/30 rounded-2xl hover:border-[#C9A34D]/60 hover:bg-[#C9A34D]/5 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#C9A34D]/10 border border-[#C9A34D]/25 flex items-center justify-center group-hover:bg-[#C9A34D]/20 transition-colors">
            <QrCode size={26} className="text-[#C9A34D]" />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-sm">مسح باركود المشروع</p>
            <p className="text-white/35 text-xs mt-0.5">امسح الباركود أو QR Code للدخول الفوري</p>
          </div>
        </button>

        {/* Project list hint */}
        <div className="bg-[#0a1525] rounded-xl border border-[#C9A34D]/10 p-4">
          <p className="text-[#C9A34D] text-[11px] font-bold mb-2">المشاريع المتاحة:</p>
          <div className="flex flex-col gap-1.5">
            {projects.map((p) => (
              <button
                key={p.projectId}
                onClick={() => { setInputId(p.projectId); resolveInput(p.projectId); }}
                className="flex items-center justify-between text-white/60 hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-right"
              >
                <span className="text-[#C9A34D]/60 font-mono">{p.projectId}</span>
                <span>{p.projectName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg sm:mx-4 bg-[#0D1B2A] border border-[#C9A34D]/20 rounded-t-3xl sm:rounded-3xl shadow-[0_-20px_80px_rgba(0,0,0,0.7)] flex flex-col max-h-[92dvh] sm:max-h-[88dvh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#C9A34D]/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A34D]/15 border border-[#C9A34D]/25 flex items-center justify-center">
              <Eye size={18} className="text-[#C9A34D]" />
            </div>
            <div>
              <h2 className="text-white font-black text-base leading-tight">كاميرات المشروع</h2>
              <p className="text-white/35 text-[11px]">مراقبة مباشرة من موقع البناء</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {renderContent()}
        </div>

        {/* Bottom drag handle (mobile) */}
        <div className="sm:hidden pb-4 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  );
}
