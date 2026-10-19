"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MNC_LOGO_VIEWBOX, mncLogoParts } from "@/components/brand/mnc-logo-paths";

// Page loader that draws the MNC logo: outlines trace in, then the colours fill.
// - IntroLoader: first page load; lifted by CSS alone (.mnc-loader--intro), no JavaScript needed.
// - RouteLoader: every page change; lifts once the new page has rendered and the drawing has finished.
// Internal tools (admin, cameras, purchasing) are excluded so daily work is not slowed down.

const START_EVENT = "mnc:route-start";
const MIN_VISIBLE_MS = 1400;
const MAX_VISIBLE_MS = 8000;
const EXIT_MS = 550;
const EXCLUDED = ["/admin", "/live-camera", "/purchase-request"];

const isExcluded = (path) => EXCLUDED.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

// Lets code that navigates with router.push() show the loader too.
export function startRouteLoader(href) {
  window.dispatchEvent(new CustomEvent(START_EVENT, { detail: href }));
}

// Splits a traced path into its sub-paths so each outline draws on its own.
const subpaths = (d) => d.split(/(?=M)/).map((part) => part.trim()).filter(Boolean);
const strokes = [
  ...subpaths(mncLogoParts.black).map((d) => ({ d, color: "#111111" })),
  ...subpaths(mncLogoParts.orange).map((d) => ({ d, color: "#f2a624" })),
];

function LogoDraw() {
  return (
    <svg viewBox={MNC_LOGO_VIEWBOX} className="mnc-draw" aria-hidden="true" focusable="false">
      <g className="mnc-draw-fill">
        <path fillRule="evenodd" fill="#f2a624" d={mncLogoParts.orange} />
        <path fillRule="evenodd" fill="#111111" d={mncLogoParts.black} />
      </g>
      <g className="mnc-draw-lines" fill="none" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        {strokes.map(({ d, color }, i) => (
          <path key={i} d={d} pathLength="1" stroke={color} style={{ animationDelay: `${(i % 8) * 0.05}s` }} />
        ))}
      </g>
    </svg>
  );
}

function LoaderArt() {
  return (
    <div className="mnc-loader__inner">
      <LogoDraw />
      <span className="mnc-loader__bar" />
    </div>
  );
}

export function IntroLoader() {
  const pathname = usePathname();
  if (isExcluded(pathname)) return null;
  return (
    <div className="mnc-loader mnc-loader--intro" aria-hidden="true">
      <LoaderArt />
    </div>
  );
}

export default function RouteLoader() {
  const pathname = usePathname();
  const [state, setState] = useState({ phase: "idle", run: 0 });
  const startedAt = useRef(0);
  const pendingPath = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const begin = (targetPath) => {
      if (targetPath === window.location.pathname) return;
      if (isExcluded(targetPath) || isExcluded(window.location.pathname)) return;
      clearTimers();
      startedAt.current = performance.now();
      pendingPath.current = targetPath;
      setState((s) => ({ phase: "visible", run: s.run + 1 }));
      timers.current.push(setTimeout(() => setState((s) => ({ ...s, phase: "leaving" })), MAX_VISIBLE_MS));
    };

    const onClick = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      begin(url.pathname);
    };
    const onStart = (event) => {
      try {
        begin(new URL(event.detail, window.location.href).pathname);
      } catch {
        // Ignore malformed targets.
      }
    };

    // Capture phase: Next.js <Link> calls preventDefault() in its own handler.
    document.addEventListener("click", onClick, true);
    window.addEventListener(START_EVENT, onStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(START_EVENT, onStart);
      clearTimers();
    };
  }, []);

  // The new page has rendered: lift the loader once the drawing has had time to finish.
  useEffect(() => {
    if (!pendingPath.current || pathname !== pendingPath.current) return;
    pendingPath.current = null;
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current));
    clearTimers();
    timers.current.push(setTimeout(() => setState((s) => ({ ...s, phase: "leaving" })), wait));
  }, [pathname]);

  useEffect(() => {
    if (state.phase !== "leaving") return undefined;
    const timer = setTimeout(() => setState((s) => ({ ...s, phase: "idle" })), EXIT_MS);
    return () => clearTimeout(timer);
  }, [state.phase]);

  if (state.phase === "idle") return null;
  return (
    <div
      key={state.run}
      className={`mnc-loader mnc-loader--route ${state.phase === "leaving" ? "is-leaving" : ""}`}
      role="status"
      aria-label="جارٍ تحميل الصفحة"
    >
      <LoaderArt />
    </div>
  );
}
