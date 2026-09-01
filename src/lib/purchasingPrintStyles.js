/* ══════════════════════════════════════════════════════════════
   Shared print stylesheet for purchasing "print area" pages (request
   detail, executive reports). The app's dark theme relies on Tailwind's
   white/opacity utility classes (text-white/60, bg-white/[0.03], ...)
   which render illegibly on paper — near-invisible light text on a
   white page once the browser drops the black page background, plus
   the custom gold scrollbar thumb/arrows get baked into the PDF for any
   overflow-x table. This mirrors the same class-substring-override
   technique globals.css already uses for the site's light-mode theme,
   just scoped to `@media print` and the given print-area id instead.
   ══════════════════════════════════════════════════════════════ */
export function PRINT_AREA_CSS(areaId) {
  return `
    body * { visibility: hidden; }
    #${areaId}, #${areaId} * { visibility: visible; }
    /* top/left/right only (no bottom/inset) — height must stay auto so
       content taller than one page flows onto page 2, 3, ... instead of
       being clipped to a single page height. */
    #${areaId} { position: absolute; top: 0; left: 0; right: 0; width: 100%; height: auto; }
    html, body { height: auto !important; overflow: visible !important; }
    .no-print { display: none !important; }

    @page { margin: 14mm; }

    #${areaId} {
      background: #ffffff !important;
      color: #1a1a1a !important;
      font-family: var(--font-body), 'Cairo', sans-serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    #${areaId} [class*="text-white"] { color: #1a1a1a !important; }
    #${areaId} [class*="bg-white\\/"] { background-color: #f7f7f5 !important; }
    #${areaId} [class*="border-white"] { border-color: #dcdcdc !important; }
    #${areaId} [class*="divide-white"] > :not([hidden]) ~ :not([hidden]) { border-color: #dcdcdc !important; }

    #${areaId} ::-webkit-scrollbar { display: none !important; }
    #${areaId} [class*="overflow-x-auto"] { overflow: visible !important; }
    #${areaId} table { width: 100% !important; table-layout: auto !important; font-size: 9px !important; }
    #${areaId} th, #${areaId} td { min-width: 0 !important; white-space: normal !important; overflow-wrap: break-word !important; }

    /* Don't slice a table row, a KPI/info card, or a signature/activity-log
       entry in half across a page break — push the whole block to the next
       page instead if it doesn't fit on the current one. */
    #${areaId} tr { page-break-inside: avoid; break-inside: avoid; }
    #${areaId} > div { page-break-inside: avoid; break-inside: avoid; }
  `;
}
