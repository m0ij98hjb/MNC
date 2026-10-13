"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Building2, Loader2, AlertCircle, Camera, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

/* ── Stream helpers (logic from /live-camera/[serial]/page.js) ──────────── */

function detectType(url, hint) {
  if (!url) return "empty";
  if (hint) return hint.toUpperCase();
  if (/\.m3u8/i.test(url)) return "HLS";
  if (/^rtsp:\/\//i.test(url)) return "RTSP";
  return "MJPEG";
}

function MjpegPlayer({ url, onError }) {
  const { t } = useLanguage();
  const [stamp, setStamp] = useState(() => Date.now());
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    queueMicrotask(() => {
      if (disposed) return;
      setFailed(false);
      setStamp(Date.now());
    });
    const iv = setInterval(() => setStamp(Date.now()), 5000);
    return () => { disposed = true; clearInterval(iv); };
  }, [url]);

  const src = url + (url.includes("?") ? "&" : "?") + "_t=" + stamp;
  if (failed) { onError?.(); return null; }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={t("camera.liveAlt")} className="w-full h-full object-contain bg-black" onError={() => setFailed(true)} />
  );
}

function HlsPlayer({ url, onError }) {
  const ref = useRef(null);
  const onErrorCb = useCallback(() => onError?.(), [onError]);

  useEffect(() => {
    if (!ref.current || !url) return;
    let hls;
    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: false });
        hls.loadSource(url);
        hls.attachMedia(ref.current);
        hls.on(Hls.Events.ERROR, (_, d) => { if (d.fatal) onErrorCb(); });
      } else if (ref.current?.canPlayType("application/vnd.apple.mpegurl")) {
        ref.current.src = url;
      } else {
        onErrorCb();
      }
    }).catch(onErrorCb);
    return () => { hls?.destroy(); };
  }, [url, onErrorCb]);

  return (
    <video ref={ref} className="w-full h-full object-contain bg-black"
      autoPlay muted playsInline onError={onErrorCb} />
  );
}

/* ── Blueprint placeholder ──────────────────────────────────────────────── */

function Placeholder({ children, isLight }) {
  const line = isLight ? "rgba(222,142,13,0.10)" : "rgba(242,166,36,0.045)";
  return (
    <div className={`keep-dark relative flex flex-col items-center justify-center w-full h-full gap-3 p-6 ${isLight ? "bg-white" : "bg-black"}`}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(${line} 1px, transparent 1px),
          linear-gradient(90deg, ${line} 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }} />
      <div className="relative z-10 flex flex-col items-center gap-3">{children}</div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

/**
 * CameraPreview
 * @param {string} projectCode — serial number entered by user; empty = idle state
 */
export default function CameraPreview({ projectCode }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === "dark"; // html.dark = light look
  const [phase, setPhase] = useState("idle"); // idle | loading | success | error
  const [cameras, setCameras] = useState([]);
  const [activeCam, setActiveCam] = useState(0);
  const [streamData, setStreamData] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [streamError, setStreamError] = useState(false);

  const loadStream = useCallback(async (serial) => {
    const res = await fetch(`/api/cameras/${encodeURIComponent(serial)}/stream`);
    if (!res.ok) throw new Error(t("camera.unavailable"));
    return res.json(); // { serialNumber, streamUrl, cameraType, status }
  }, [t]);

  useEffect(() => {
    if (!projectCode) {
      queueMicrotask(() => {
        setPhase("idle");
        setCameras([]);
        setStreamData(null);
      });
      return;
    }

    let cancelled = false;
    (async () => {
      setPhase("loading");
      setErrMsg("");
      setStreamError(false);
      try {
        // 1. Verify serial via existing API
        const verRes = await fetch(`/api/cameras/${encodeURIComponent(projectCode)}`);
        if (!verRes.ok) throw new Error(t("camera.invalidOrNotFound"));
        const cam = await verRes.json();
        if (cancelled) return;

        // 2. Find sibling cameras (same projectName) via existing /api/cameras
        let siblings = [cam];
        try {
          const allRes = await fetch("/api/cameras");
          if (allRes.ok) {
            const { cameras: all } = await allRes.json();
            const related = all.filter(c => c.projectName === cam.projectName);
            if (related.length) siblings = related;
          }
        } catch { /* non-fatal — fall back to single camera */ }
        if (cancelled) return;
        setCameras(siblings);
        setActiveCam(0);

        // 3. Fetch stream for first camera via existing /api/cameras/[serial]/stream
        const stream = await loadStream(siblings[0].serialNumber);
        if (cancelled) return;
        setStreamData(stream);
        setPhase("success");
      } catch (e) {
        if (!cancelled) { setPhase("error"); setErrMsg(e.message || t("camera.connectionError")); }
      }
    })();
    return () => { cancelled = true; };
  }, [projectCode, loadStream, t]);

  const switchTo = useCallback(async (idx) => {
    if (idx === activeCam) return;
    setActiveCam(idx);
    setStreamError(false);
    try {
      const stream = await loadStream(cameras[idx].serialNumber);
      setStreamData(stream);
    } catch { setStreamError(true); }
  }, [activeCam, cameras, loadStream]);

  const activeCamInfo = cameras[activeCam];
  const streamType = streamData ? detectType(streamData.streamUrl, streamData.cameraType) : null;
  const isLive = phase === "success" && streamData?.status !== "offline" && !streamError;

  /* ── Render helpers ── */

  const badge = (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
      isLive
        ? "bg-red-500/20 text-red-400 border border-red-500/30"
        : "bg-white/10 text-white/40 border border-white/10"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-white/30"}`} />
      {isLive ? t("camera.live") : t("camera.offline")}
    </div>
  );

  const renderStream = () => {
    if (!streamData?.streamUrl || streamError) return null;
    if (streamType === "MJPEG") return <MjpegPlayer url={streamData.streamUrl} onError={() => setStreamError(true)} />;
    if (streamType === "HLS")   return <HlsPlayer   url={streamData.streamUrl} onError={() => setStreamError(true)} />;
    if (streamType === "HTTPS" || streamType === "PORTAL") {
      return (
        <iframe src={streamData.streamUrl} className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          title={t("camera.streamTitle")} allowFullScreen />
      );
    }
    if (streamType === "RTSP") {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
          <Camera size={28} className="text-[#f2a624]" />
          <p className="text-white/50 text-xs text-center">{t("camera.rtspRequiresVlc")}</p>
          <a href={streamData.streamUrl} className="text-[#f2a624] text-[10px] underline break-all text-center"
            target="_blank" rel="noopener noreferrer">{t("camera.openLink")}</a>
        </div>
      );
    }
    return null;
  };

  /* ── States ── */

  if (phase === "idle") {
    return (
      <div className="w-full h-full">
        <Placeholder isLight={isLight}>
          <Building2 size={42} className={isLight ? "text-[#f2a624]/70" : "text-[#f2a624]/35"} />
          <p className={`text-xs text-center leading-relaxed ${isLight ? "text-[#64748b]" : "text-white/25"}`}>
            {t("camera.enterProjectCode")}<br />{t("camera.toViewCamera")}
          </p>
        </Placeholder>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="w-full h-full">
        <Placeholder isLight={isLight}>
          <Loader2 size={32} className={`animate-spin ${isLight ? "text-[#de8e0d]" : "text-[#f2a624]"}`} />
          <p className={`text-xs ${isLight ? "text-[#64748b]" : "text-white/40"}`}>{t("camera.verifying")}</p>
        </Placeholder>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="w-full h-full">
        <Placeholder isLight={isLight}>
          <AlertCircle size={32} className={isLight ? "text-red-600/80" : "text-red-400/70"} />
          <p className={`text-xs text-center leading-relaxed ${isLight ? "text-red-700" : "text-red-400/75"}`}>{errMsg}</p>
        </Placeholder>
      </div>
    );
  }

  /* ── Success ── */
  return (
    <div className="flex flex-col w-full h-full">

      {/* Top bar: badge + camera switcher */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
        {badge}
        {cameras.length > 1 && (
          <div className="flex gap-1">
            {cameras.map((c, i) => (
              <button
                key={c.serialNumber}
                onClick={() => switchTo(i)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f2a624]/60
                  ${i === activeCam ? "text-[#f2a624] bg-[#f2a624]/15" : "text-white/35 hover:text-white/60"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stream area */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {streamError ? (
          <Placeholder>
            <AlertCircle size={26} className="text-red-400/70" />
            <p className="text-white/40 text-xs">{t("camera.streamLoadFailed")}</p>
            <button
              onClick={() => {
                setStreamError(false);
                loadStream(activeCamInfo?.serialNumber)
                  .then(setStreamData)
                  .catch(() => setStreamError(true));
              }}
              className="flex items-center gap-1 text-[#f2a624] text-[10px] hover:text-[#f2a624] transition-colors
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f2a624]/60 rounded px-1"
            >
              <RefreshCw size={11} />{t("camera.retry")}
            </button>
          </Placeholder>
        ) : renderStream()}
      </div>

      {/* Bottom label */}
      <div className="px-3 py-2 shrink-0" style={{ background: "rgba(0,0,0,0.7)" }}>
        <p className="text-white/55 text-[10px] font-medium truncate" dir={isRTL ? "rtl" : "ltr"}>
          {activeCamInfo?.cameraName || t("camera.cameraNameFallback")}
          {activeCamInfo?.projectLocation ? ` — ${activeCamInfo.projectLocation}` : ""}
        </p>
      </div>

    </div>
  );
}
