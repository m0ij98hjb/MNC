'use client';

import { useEffect, useState } from 'react';
import { useMusic } from '@/context/MusicContext';

export default function MusicTapOverlay() {
  const { needsInteraction } = useMusic();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (needsInteraction) setVisible(true);
    else setVisible(false);
  }, [needsInteraction]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
    >
      <div className="flex flex-col items-center gap-4 select-none pointer-events-none">
        {/* Pulsing music note */}
        <div className="relative flex items-center justify-center">
          <span
            className="absolute inline-block rounded-full"
            style={{
              width: 80, height: 80,
              background: 'rgba(213,178,93,0.18)',
              animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
            }}
          />
          <span
            className="relative inline-flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: 'rgba(213,178,93,0.22)', border: '1.5px solid rgba(213,178,93,0.5)' }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V5l12-2v13" stroke="#D5B25D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="#D5B25D" strokeWidth="2"/>
              <circle cx="18" cy="16" r="3" stroke="#D5B25D" strokeWidth="2"/>
            </svg>
          </span>
        </div>

        <p style={{ color: '#D5B25D', fontSize: 17, fontWeight: 600, letterSpacing: 1 }}>
          اضغط للدخول
        </p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          tap to enter
        </p>
      </div>
    </div>
  );
}
