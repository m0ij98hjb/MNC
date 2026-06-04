'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoicePresentation() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const utteranceRef = useRef(null);

  // نص احترافي يعبر عن الشركة والمدير
  const presentationText = `مرحباً بكم في شركة MNC للمقاولات والتصميم المعماري.
أنا المهندس مروان أحمد ناظر، المدير التنفيذي للشركة.

مؤسستنا تعتبر من المؤسسات الرائدة في المملكة، حيث نجمع بين الأصالة الهندسية والرؤية العصرية.
لدينا خبرة تزيد على 15 سنة في مجال الهندسة والبناء والتصميم.

رسالتنا واضحة: نحن لا نبني جدراناً فقط، بل نُصمم مستقبلاً متميزاً.

نقدم خدمات متكاملة تشمل:
- مشاريع المقاولات بأعلى معايير السلامة والجودة
- التصميم المعماري المبتكر الذي يجمع بين الجمالية والوظيفة
- إدارة احترافية للمشاريع من البداية إلى النهاية
- التصميم الداخلي الفاخر الذي يعكس ذوقكم الرفيع

ما يميزنا هو التزامنا الكامل بـ:
دقة التنفيذ وفقاً لأحدث المعايير الهندسية العالمية
الابتكار والحلول الذكية في كل مشروع
الإدارة المحترفة والإشراف الدقيق على كل التفاصيل
الالتزام التام بالمواعيد وتسليم المشاريع في الوقت المحدد

إن فريقنا متخصص وعالي الكفاءة، ومجهز بأحدث التقنيات المعمارية والإنشائية.
نحن هنا لتحويل أحلامكم الهندسية إلى واقع ملموس وتحفة معمارية.

شكراً لاختيارك MNC - حيث نصمم التميز.`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlayPause = () => {
    if (!synth || !isMounted) return;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(presentationText);
      utterance.lang = 'ar-SA';
      utterance.rate = 1;
      utterance.pitch = 1.1;
      utterance.volume = volume;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!synth || !isMounted || !isPlaying || !utteranceRef.current) return;
    utteranceRef.current.volume = volume;
  }, [volume, isMounted, isPlaying, synth]);

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-2"
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
              className="flex flex-col items-center gap-2 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 p-4 rounded-2xl shadow-lg border border-[#c5a059]/20"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(e.target.value / 100)}
                className="w-20 h-1 transform -rotate-90 origin-left accent-[#c5a059]"
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
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          className={`relative p-5 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isPlaying
              ? 'bg-[#c5a059] text-white shadow-[0_0_20px_rgba(197,160,89,0.4)]'
              : 'bg-white dark:bg-slate-900 text-[#0f172a] dark:text-[#c5a059] border-2 border-[#c5a059]/30'
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
              className="text-xs font-semibold text-[#c5a059] text-center whitespace-nowrap"
            >
              🎙️ تعريف الشركة
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
