'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useMusic } from '@/context/MusicContext';
import { usePathname } from 'next/navigation';

// BCP-47 tags for SpeechSynthesis per language code
const LANG_BCP47 = {
  ar: 'ar-SA',
  en: 'en-US',
  zh: 'zh-CN',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  tr: 'tr-TR',
  ur: 'ur-PK',
  ru: 'ru-RU',
};

export default function VoicePresentation() {
  const pathname = usePathname();
  const { t, isRTL, lang } = useLanguage();
  const { pauseMusicForVoice, resumeMusicAfterVoice } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const uttRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [resumeMusicAfterVoice]);

  // Stop speech when language changes
  useEffect(() => {
    if (!isMounted) return;
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      resumeMusicAfterVoice();
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      resumeMusicAfterVoice();
      return;
    }

    const text = t('voice.text');
    if (!text || text === 'voice.text') return;

    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_BCP47[lang] || 'ar-SA';
    utt.rate = 0.92;
    utt.pitch = 1;
    utt.volume = 1;

    utt.onend = () => {
      setIsPlaying(false);
      resumeMusicAfterVoice();
    };

    utt.onerror = () => {
      setIsPlaying(false);
      resumeMusicAfterVoice();
    };

    uttRef.current = utt;
    pauseMusicForVoice();
    window.speechSynthesis.speak(utt);
    setIsPlaying(true);
  }, [isPlaying, lang, t, pauseMusicForVoice, resumeMusicAfterVoice]);

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
        {/* زر التشغيل الرئيسي */}
        <motion.button
          onClick={handlePlayPause}
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

          {/* نبضة الصوت أثناء التشغيل */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full animate-ping bg-[var(--secondary)] opacity-25 pointer-events-none" />
          )}
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
