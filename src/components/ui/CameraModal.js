"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Eye, Camera, QrCode, Search, ExternalLink,
  WifiOff, ChevronLeft, Loader2, RefreshCw, SwitchCamera,
} from "lucide-react";
import { projects } from "@/lib/cameraConfig";

/* ─────────────────── MJPEG feed ─────────────────── */
function MjpegFeed({ stream }) {
  const [error, setError] = useState(false);
  const [stamp, setStamp] = useState(() => Date.now());

  useEffect(() => {
    setError(false);
    setStamp(Date.now());
    const iv = setInterval(() => setStamp(Date.now()), 3000);
    return () => clearInterval(iv);
  }, [stream.url]);

  const src = stream.url + (stream.url.includes("?") ? "&" : "?") + "_t=" + stamp;

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
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
        <img src={src} alt={stream.name} onError={() => setError(true)} className="w-full h-full object-cover" />
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
        hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setError(true); });
      } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = stream.url;
      } else {
        setError(true);
      }
    }).catch(() => setError(true));
    return () => { if (hls) hls.destroy(); };
  }, [stream.url]);

  if (error) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center gap-2">
        <WifiOff size={28} className="text-red-500" />
        <p className="text-red-400 text-xs font-bold">الكاميرا غير متصلة</p>
      </div>
    );
  }

  return (
    <video ref={videoRef} className="w-full h-full object-cover bg-black"
      autoPlay muted playsInline onError={() => setError(true)} />
  );
}

/* ─────────────────── Camera card ─────────────────── */
function CameraCard({ stream }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-[#C9A34D]/20 bg-black flex flex-col" style={{ minHeight: 160 }}>
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.04] border-b border-[#C9A34D]/15 shrink-0">
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
      <div className="flex-1" style={{ minHeight: 120 }}>
        {stream.type === "hls" ? <HlsFeed stream={stream} /> : <MjpegFeed stream={stream} />}
      </div>
    </div>
  );
}

/* ─────────────────── QR / Barcode Scanner ─────────────────── */
function QrScanView({ onResult, onBack }) {
  const [status,      setStatus]      = useState("idle");
  const [errMsg,      setErrMsg]      = useState("");
  const [cameras,     setCameras]     = useState([]);
  const [activeCamId, setActiveCamId] = useState(null);
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && startedRef.current) {
      await scannerRef.current.stop().catch(() => {});
      startedRef.current = false;
    }
  }, []);

  const startScanner = useCallback(async (camId) => {
    await stopScanner();
    setStatus("loading");
    setErrMsg("");

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      /* Enumerate cameras once */
      let camList = cameras;
      if (!camList.length) {
        try {
          camList = await Html5Qrcode.getCameras();
          setCameras(camList);
        } catch { camList = []; }
      }

      /* Pick camera: prefer back/environment, fallback to last, fallback to facingMode */
      let cameraConstraint;
      if (camId) {
        cameraConstraint = camId;
        setActiveCamId(camId);
      } else if (camList.length) {
        const backCam = camList.find(c => /back|rear|environment/i.test(c.label));
        const chosen  = backCam ?? camList[camList.length - 1];
        setActiveCamId(chosen.id);
        cameraConstraint = chosen.id;
      } else {
        cameraConstraint = { facingMode: "environment" };
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("mnc-qr-reader", { verbose: false });
      }

      /* All major barcode + QR formats */
      const formats = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
        Html5QrcodeSupportedFormats.PDF_417,
        Html5QrcodeSupportedFormats.AZTEC,
      ].filter(Boolean);

      await scannerRef.current.start(
        cameraConstraint,
        { fps: 15, qrbox: { width: 230, height: 230 }, formatsToSupport: formats },
        (text) => { stopScanner(); onResult(text); },
        () => {}
      );
      startedRef.current = true;
      setStatus("scanning");
    } catch (e) {
      setStatus("error");
      setErrMsg(
        e?.message?.includes("NotAllowed")
          ? "تم رفض إذن الكاميرا — يرجى السماح بالوصول من إعدادات المتصفح"
          : e?.message?.includes("NotFound") || e?.message?.includes("DevicesNotFound")
          ? "لم يتم العثور على كاميرا متصلة"
          : "تعذّر تشغيل الكاميرا — تأكد من الاتصال الآمن (HTTPS)"
      );
    }
  }, [cameras, onResult, stopScanner]);

  useEffect(() => {
    startScanner(null);
    return () => { stopScanner(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchCamera = useCallback(async (camId) => {
    setActiveCamId(camId);
    await startScanner(camId);
  }, [startScanner]);

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <p className="text-sm text-center text-white/50">
        وجّه الكاميرا نحو الباركود أو QR Code — يدعم جميع أنواع الباركود
      </p>

      {/* Viewfinder */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A34D]/35 w-full max-w-[280px] aspect-square bg-black flex items-center justify-center">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-black/80">
            <Loader2 size={32} className="text-[#C9A34D] animate-spin" />
            <span className="text-white/50 text-xs">جاري تشغيل الكاميرا...</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <WifiOff size={28} className="text-red-500" />
            <p className="text-red-400 text-sm font-bold leading-snug">{errMsg}</p>
            <button
              onClick={() => startScanner(activeCamId)}
              className="flex items-center gap-1.5 text-[#C9A34D] text-xs border border-[#C9A34D]/30 px-3 py-1.5 rounded-lg hover:bg-[#C9A34D]/10 transition-colors"
            >
              <RefreshCw size={11} /> إعادة المحاولة
            </button>
          </div>
        )}

        <div id="mnc-qr-reader" className="w-full h-full" />

        {/* Corner brackets */}
        {status === "scanning" && (
          <>
            <div className="absolute top-3 left-3   w-7 h-7 border-t-2 border-l-2 border-[#C9A34D] rounded-tl pointer-events-none" />
            <div className="absolute top-3 right-3  w-7 h-7 border-t-2 border-r-2 border-[#C9A34D] rounded-tr pointer-events-none" />
            <div className="absolute bottom-3 left-3  w-7 h-7 border-b-2 border-l-2 border-[#C9A34D] rounded-bl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#C9A34D] rounded-br pointer-events-none" />
            {/* Scan line */}
            <div className="absolute left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#C9A34D] to-transparent pointer-events-none animate-[scan_2s_ease-in-out_infinite]"
              style={{ top: "50%", boxShadow: "0 0 6px rgba(201,163,77,0.8)" }} />
          </>
        )}
      </div>

      {/* Camera switcher — only when multiple cameras */}
      {cameras.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <SwitchCamera size={13} className="text-[#C9A34D]/50 shrink-0" />
          {cameras.map((cam, i) => (
            <button
              key={cam.id}
              onClick={() => switchCamera(cam.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                activeCamId === cam.id
                  ? "bg-[#C9A34D]/15 border-[#C9A34D]/45 text-[#C9A34D] font-bold"
                  : "bg-white/[0.04] border-white/10 text-white/35 hover:text-white/60 hover:bg-white/[0.07]"
              }`}
            >
              {cam.label?.replace(/\s*\(.*?\)\s*/g, "").trim() || `كاميرا ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#C9A34D]/60 hover:text-[#C9A34D] text-sm transition-colors mt-1"
      >
        <ChevronLeft size={16} /> رجوع
      </button>
    </div>
  );
}

/* ─────────────────── Main Modal ─────────────────── */
export default function CameraModal({ onClose }) {
  const [view,        setView]        = useState("entry");
  const [inputId,     setInputId]     = useState("");
  const [projectData, setProjectData] = useState(null);
  const [directUrl,   setDirectUrl]   = useState("");
  const [inputErr,    setInputErr]    = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const resolveInput = useCallback((value) => {
    const v = (value || "").trim();

    /* Empty → open scanner */
    if (!v) { setView("scan"); return; }

    /* Direct URL (HTTP/HTTPS/RTSP) */
    if (/^(https?|rtsp):\/\//i.test(v)) {
      setDirectUrl(v);
      setView("direct");
      return;
    }

    /* Look up project list */
    const found = projects.find(
      (p) => p.projectId.toUpperCase() === v.toUpperCase()
    );
    if (found) {
      setProjectData(found);
      setInputErr("");
      setView("cameras");
    } else {
      /* Not in list → activate barcode scanner */
      setInputErr("");
      setView("scan");
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
          onBack={() => { setView("entry"); setInputErr(""); }}
        />
      );
    }

    if (view === "cameras" && projectData) {
      const cols = projectData.streams.length === 1 ? 1 : 2;
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-white">{projectData.projectName}</h3>
            <button
              onClick={() => { setView("entry"); setProjectData(null); }}
              className="flex items-center gap-1 text-[#C9A34D]/60 hover:text-[#C9A34D] text-xs transition-colors"
            >
              <ChevronLeft size={14} /> تغيير المشروع
            </button>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {projectData.streams.map((s) => <CameraCard key={s.id} stream={s} />)}
          </div>
        </div>
      );
    }

    if (view === "direct") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm truncate max-w-[200px] text-white">{directUrl}</h3>
            <button
              onClick={() => { setView("entry"); setDirectUrl(""); }}
              className="flex items-center gap-1 text-[#C9A34D]/60 hover:text-[#C9A34D] text-xs transition-colors"
            >
              <ChevronLeft size={14} /> رجوع
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-[#C9A34D]/20" style={{ height: 380 }}>
            <iframe src={directUrl} title="كاميرا مباشرة" className="w-full h-full bg-black"
              allowFullScreen sandbox="allow-scripts allow-same-origin" />
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
      <div className="flex flex-col gap-5">

        {/* Manual input */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#C9A34D] mb-1">
            <Search size={15} />
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
              className="flex-1 rounded-xl px-4 py-3 text-sm bg-white/[0.05] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C9A34D]/50 transition-colors"
            />
            <button
              onClick={() => resolveInput(inputId)}
              className="px-5 py-3 bg-gradient-to-r from-[#C9A34D] to-[#e0b85a] text-black font-black text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_18px_rgba(201,163,77,0.3)]"
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
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-white/25">أو</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Scan button */}
        <button
          onClick={() => setView("scan")}
          className="flex flex-col items-center gap-3 py-6 border-2 border-dashed border-[#C9A34D]/25 hover:border-[#C9A34D]/55 rounded-2xl hover:bg-[#C9A34D]/[0.04] transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#C9A34D]/10 border border-[#C9A34D]/20 flex items-center justify-center group-hover:bg-[#C9A34D]/18 transition-colors">
            <QrCode size={26} className="text-[#C9A34D]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-white">مسح باركود المشروع</p>
            <p className="text-xs mt-0.5 text-white/30">QR Code · Barcode · جميع الأنواع</p>
          </div>
        </button>

        {/* Project quick-list */}
        {projects.length > 0 && (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[#C9A34D] text-[11px] font-bold mb-2.5">المشاريع المتاحة:</p>
            <div className="flex flex-col gap-1">
              {projects.map((p) => (
                <button
                  key={p.projectId}
                  onClick={() => { setInputId(p.projectId); resolveInput(p.projectId); }}
                  className="flex items-center justify-between text-xs px-2.5 py-2 rounded-lg text-right hover:bg-white/[0.05] transition-colors group"
                >
                  <span className="text-[#C9A34D]/55 font-mono group-hover:text-[#C9A34D]/80 transition-colors">{p.projectId}</span>
                  <span className="text-white/50 group-hover:text-white/75 transition-colors">{p.projectName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center" dir="rtl">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Panel — always dark to match site */}
      <div className="relative z-10 w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[92dvh] sm:max-h-[88dvh] bg-[#0a0a0a] border border-[#C9A34D]/15 shadow-[0_-20px_80px_rgba(0,0,0,0.9)]">

        {/* Thin gold top accent */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C9A34D]/40 to-transparent rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C9A34D]/10 border border-[#C9A34D]/20 flex items-center justify-center">
              <Eye size={17} className="text-[#C9A34D]" />
            </div>
            <div>
              <h2 className="font-black text-base text-white leading-tight">كاميرات المشروع</h2>
              <p className="text-[11px] text-white/30">مراقبة مباشرة من موقع البناء</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {renderContent()}
        </div>

        {/* Drag handle (mobile) */}
        <div className="sm:hidden pb-4 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 20%; }
          50% { top: 80%; }
        }
      `}</style>
    </div>
  );
}
