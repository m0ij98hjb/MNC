'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoicePresentation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio('/asstes/presentation.mp3');
    audioRef.current.onended = () => setIsPlaying(false);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

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
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-8 left-8 z-40 flex flex-col items-center gap-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* التحكم في مستوى الصوت */}
        <AnimatePresence>
          {showVolumeControl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center gap-2 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 p-4 rounded-2xl shadow-lg border border-[#D5B25D]/20"
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
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          className={`relative p-5 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${isPlaying
              ? 'bg-[#D5B25D] text-white shadow-[0_0_20px_rgba(213,178,93,0.4)]'
              : 'bg-white dark:bg-slate-900 text-[#0f172a] dark:text-[#D5B25D] border-2 border-[#D5B25D]/30'
            }`}
          title={isPlaying ? 'إيقاف الكلام' : 'تشغيل الكلام'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none"
              >
                <Mic size={26} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
              className="text-xs font-semibold text-[#D5B25D] text-center whitespace-nowrap"
            >
              🎙️ تعريف الشركة
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
