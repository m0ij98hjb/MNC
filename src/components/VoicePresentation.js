'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useMusic } from '@/context/MusicContext';
import { usePathname } from 'next/navigation';

export default function VoicePresentation() {
  const pathname = usePathname();
  const { t, isRTL, lang } = useLanguage();
  const { pauseMusicForVoice, resumeMusicAfterVoice } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef(null);

  // Swap audio file when language changes
  useEffect(() => {
    if (!isMounted) return;
    const src = `/asstes/presentation-${lang}.mp3`;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    const audio = new Audio(src);
    audio.playbackRate = 1.1;
    audio.volume = volume;
    audio.onended = () => {
      setIsPlaying(false);
      resumeMusicAfterVoice();
    };
    audioRef.current = audio;
  }, [lang, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [resumeMusicAfterVoice]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      // Resume music when voice stops
      resumeMusicAfterVoice();
    } else {
      // Pause music when voice starts
      pauseMusicForVoice();
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  if (!isMounted) return null;
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.div
        className={`fixed bottom-8 ${isRTL ? 'right-8' : 'left-8'} z-40 flex flex-col items-center gap-2`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* التحكم في مستوى الصوت */}
        <AnimatePresence>
          {showVolumeControl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center gap-2 bg-[var(--card-bg)]/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[rgba(213,178,93,0.2)]"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(e.target.value / 100)}
                className="w-20 h-1 transform -rotate-90 origin-left accent-[#D5B25D]"
                style={{ transformOrigin: 'left center' }}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر التشغيل الرئيسي */}
        <motion.button
          onClick={handlePlayPause}
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, mass: 0.5 }}
          className="relative p-5 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer bg-[var(--secondary)] text-[var(--foreground)] shadow-[0_0_20px_rgba(213,178,93,0.4)]"
          title={isPlaying ? t('voice.stop') : t('voice.play')}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none"
              >
                <Mic size={26} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none"
              >
                <MicOff size={26} strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* نص معلوماتي */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-semibold text-[var(--secondary)] text-center whitespace-nowrap"
            >
              🎙️ {t('voice.intro')}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
