'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
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
      // إيقاف أي عملية كلام حالية
      synth.cancel();

      // إنشاء جملة جديدة
      const utterance = new SpeechSynthesisUtterance(presentationText);
      utterance.lang = 'ar-SA'; // اللغة العربية - السعودية
      utterance.rate = 1; // سرعة النطق
      utterance.pitch = 1.1; // طبقة الصوت
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

    // تحديث مستوى الصوت
    utteranceRef.current.volume = volume;
  }, [volume, isMounted, isPlaying, synth]);

  if (!isMounted) return null;

  return (
    <>
      {/* مكون التحكم في الكلام الصوتي */}
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
              className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(e.target.value / 100)}
                className="w-20 h-1 transform -rotate-90 origin-left"
                style={{ transformOrigin: 'left center' }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative p-4 rounded-full shadow-xl transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600'
          } hover:shadow-2xl`}
          title={isPlaying ? 'إيقاف الكلام' : 'تشغيل الكلام'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
              >
                <Volume2 size={24} className="animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
              >
                <VolumeX size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* التأثير المرئي عند التشغيل */}
          {isPlaying && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400 opacity-20"
                animate={{ scale: [1, 1.5, 1.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500 opacity-10"
                animate={{ scale: [1, 1.3, 1.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.button>

        {/* نص معلوماتي */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-gray-600 dark:text-gray-400 text-center whitespace-nowrap"
            >
              🎙️ تعريف الشركة
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
