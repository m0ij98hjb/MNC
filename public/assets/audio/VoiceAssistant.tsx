// components/VoiceAssistant.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

// ─── النصوص الكاملة ────────────────────────────────────────────────────────
const SCRIPTS: Record<string, string> = {
  welcome: `مرحباً بكم في مؤسسة مروان أحمد ناظر للمقاولات العامة.
أنا نورا، مساعدتكم الصوتية.
يسعدنا استقبالكم في موقع شركة MNC Construction،
الشركة الرائدة في مجال الإنشاءات والتصميم المعماري بالمملكة العربية السعودية.
نحن هنا لنساعدكم في التعرف على خدماتنا ومشاريعنا المميزة.`,

  director: `يشرفنا تقديم المهندس مروان أحمد ناظر،
المدير التنفيذي والمؤسس لشركة MNC Construction.
يمتلك المهندس مروان خبرة تمتد لأكثر من خمس عشرة سنة
في مجال الهندسة المعمارية والإنشاءات.
تحت قيادته الحكيمة، تمكنت الشركة من إنجاز أكثر من مئتي مشروع ناجح.
وهو يقول دائماً:
مهمتنا هي تقديم تميز هندسي يفوق التوقعات،
مع التركيز على الاستدامة والابتكار في كل تفصيلة إنشائية.`,

  services: `تقدم شركة MNC Construction باقة متكاملة من الخدمات الهندسية الاحترافية.
أولاً: مشاريع المقاولات، حيث ننفذ كافة أعمال الإنشاءات والمباني السكنية والتجارية.
ثانياً: التصميم المعماري، ونبتكر حلولاً تصميمية فريدة تجمع بين الجمالية والوظيفة.
ثالثاً: إدارة المشاريع، مع إشراف هندسي متكامل على كل مراحل العمل.
رابعاً: التصميم الداخلي، بلمسات إبداعية تضفي الفخامة والراحة.`,

  features: `تتميز شركة MNC Construction بأربعة محاور رئيسية.
المحور الأول: دقة التنفيذ، حيث نلتزم بأدق المعايير الهندسية لضمان جودة استثنائية.
المحور الثاني: الحلول المبتكرة، إذ نستخدم أحدث التقنيات المعمارية.
المحور الثالث: الإدارة الاحترافية، من خلال فريق متخصص يتابع كل مراحل المشروع.
وأخيراً: الالتزام الكامل بالمواعيد، لأننا نُقدّر وقتكم.`,

  projects: `أنجزت شركة MNC Construction مجموعة متنوعة من المشاريع المميزة في مدينة جدة.
من أبرزها: فيلا سكنية فاخرة في حي أبحر، تجمع بين الفخامة والتصميم العصري.
وبرج إداري تجاري على طريق الملك، يعكس الاحترافية والتميز.
ومجمع فلل مودرن في حي المحمدية، يوفر أعلى معايير الراحة.
إضافة إلى مقر شركة هندسية في حي الروضة.
ولا تزال هناك مشاريع كثيرة قيد التنفيذ.`,

  contact: `يسعدنا التواصل معكم في أي وقت.
يمكنكم زيارة موقعنا الإلكتروني، أو التواصل معنا عبر صفحة التواصل.
فريقنا الهندسي المتخصص جاهز للإجابة على جميع استفساراتكم.
نحن في مؤسسة مروان أحمد ناظر للمقاولات نرحب بكل عملائنا
ونحرص على تقديم أفضل الحلول الهندسية.`,

  vision: `رؤيتنا في شركة MNC Construction تنبع من قناعة راسخة
بأننا لا نبني جدراناً، بل نُصمم مستقبلاً متميزاً.
نجمع بين الأصالة الهندسية والرؤية العصرية،
ونلتزم بتحويل المخططات إلى بصمات معمارية تنبض بالحياة والجودة.
نسعى دائماً نحو الاستدامة والابتكار في كل تفصيلة إنشائية.`,
}

const TOPICS = [
  { key: 'director', label: 'المدير التنفيذي', icon: '👤' },
  { key: 'services',  label: 'خدماتنا',         icon: '🔧' },
  { key: 'features',  label: 'مميزاتنا',         icon: '⭐' },
  { key: 'projects',  label: 'المشاريع',          icon: '🏗️' },
  { key: 'contact',   label: 'تواصل معنا',        icon: '📞' },
  { key: 'vision',    label: 'رؤيتنا',            icon: '👁️' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function VoiceAssistant() {
  const [isOpen, setIsOpen]       = useState(false)
  const [speaking, setSpeaking]   = useState(false)
  const [status, setStatus]       = useState('جاهزة للتحدث')
  const [displayText, setDisplay] = useState('')
  const [progress, setProgress]   = useState(0)
  const [supported, setSupported] = useState(true)
  const lastTextRef = useRef('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSupported(false)
    }
  }, [])

  // Play background music when panel opens
  useEffect(() => {
    if (isOpen) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/assets/audio/background-music.wav')
        audioRef.current.loop = true
        audioRef.current.volume = 0.3
      }
      audioRef.current.play().catch(() => {
        // Silently fail if audio can't autoplay
      })
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isOpen])

  // ─── Get best Arabic female voice ─────────────────────────────────────────
  function getVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices()
    return (
      voices.find(v => v.lang === 'ar-SA' && !v.name.includes('Maged')) ||
      voices.find(v => v.lang === 'ar-SA') ||
      voices.find(v => v.lang.startsWith('ar')) ||
      null
    )
  }

  // ─── Speak ─────────────────────────────────────────────────────────────────
  function speak(text: string) {
    if (!supported) return
    window.speechSynthesis.cancel()
    lastTextRef.current = text
    setDisplay(text)
    setProgress(10)

    const u = new SpeechSynthesisUtterance(text)
    u.lang    = 'ar-SA'
    u.rate    = 0.88
    u.pitch   = 1.15
    u.volume  = 1

    // Load voices (may need a small delay on some browsers)
    const trySpeak = () => {
      const voice = getVoice()
      if (voice) u.voice = voice

      u.onstart = () => {
        setSpeaking(true)
        setStatus('تتحدث نورا الآن...')
        setProgress(20)
      }

      u.onboundary = (e) => {
        const p = Math.min(92, 20 + (e.charIndex / text.length) * 72)
        setProgress(Math.round(p))
      }

      u.onend = () => {
        setSpeaking(false)
        setStatus('انتهت — اختر موضوعاً')
        setProgress(100)
        setTimeout(() => setProgress(0), 1500)
      }

      u.onerror = () => {
        setSpeaking(false)
        setStatus('خطأ — جرب مرة أخرى')
        setProgress(0)
      }

      window.speechSynthesis.speak(u)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

  function stopSpeech() {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setStatus('متوقفة')
    setProgress(0)
  }

  function repeatLast() {
    if (lastTextRef.current) speak(lastTextRef.current)
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #D4AF65, #8A6C27)',
          boxShadow: '0 4px 20px rgba(184,146,58,0.45)',
        }}
        aria-label="المساعدة الصوتية"
      >
        <span className="text-2xl">{isOpen ? '✕' : '🎙️'}</span>
      </button>

      {/* ── Panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 z-50 w-[340px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(160deg, #0f0e0a, #1a1208)',
            border: '1px solid rgba(184,146,58,0.3)',
          }}
        >
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: 'rgba(184,146,58,0.15)' }}>
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 relative"
                style={{
                  background: 'linear-gradient(135deg,#D4AF65,#8A6C27)',
                  boxShadow: speaking ? '0 0 0 3px rgba(184,146,58,0.4)' : 'none',
                  transition: 'box-shadow .3s',
                }}
              >
                🎙️
                {speaking && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ border: '2px solid #B8923A', animation: 'ring 1.2s ease-out infinite' }}
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#D4AF65' }}>نورا — المساعدة الصوتية</p>
                <p className="text-xs" style={{ color: '#888' }}>مؤسسة مروان أحمد ناظر</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: '#B8923A',
                  animation: speaking ? 'pulse 1s infinite' : 'none',
                }}
              />
              <span className="text-xs" style={{ color: '#B8923A' }}>{status}</span>
            </div>

            {/* Progress bar */}
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#D4AF65,#B8923A)',
                }}
              />
            </div>
          </div>

          {/* Wave bars */}
          <div className="flex items-center justify-center gap-1 py-3" style={{ height: 44 }}>
            {[0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0].map((delay, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all"
                style={{
                  background: '#B8923A',
                  height: speaking ? undefined : '6px',
                  opacity: speaking ? 1 : 0.2,
                  animation: speaking ? `wave .8s ${delay}s ease-in-out infinite` : 'none',
                }}
              />
            ))}
          </div>

          {/* Text display */}
          {displayText && (
            <div
              className="mx-4 mb-3 p-3 rounded-xl text-xs leading-relaxed"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,146,58,0.12)',
                color: '#d0c8b8',
                maxHeight: '80px',
                overflowY: 'auto',
                direction: 'rtl',
              }}
            >
              {displayText.split('\n')[0]}...
            </div>
          )}

          {/* Main controls */}
          <div className="px-4 pb-3 flex gap-2">
            {!speaking ? (
              <button
                onClick={() => speak(SCRIPTS.welcome)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-opacity hover:opacity-85"
                style={{ background: 'linear-gradient(135deg,#D4AF65,#8A6C27)' }}
              >
                ▶ ابدأ الترحيب
              </button>
            ) : (
              <button
                onClick={stopSpeech}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                ⏹ إيقاف
              </button>
            )}
            {lastTextRef.current && !speaking && (
              <button
                onClick={repeatLast}
                className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: 'rgba(184,146,58,0.1)', color: '#B8923A', border: '1px solid rgba(184,146,58,0.25)' }}
                title="أعد الكلام"
              >
                🔄
              </button>
            )}
          </div>

          {/* Topics grid */}
          <div className="grid grid-cols-2 gap-2 px-4 pb-4">
            {TOPICS.map(t => (
              <button
                key={t.key}
                onClick={() => speak(SCRIPTS[t.key])}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-right flex items-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(184,146,58,0.18)',
                  color: '#bbb',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Notice */}
          {!supported && (
            <p className="text-center text-xs px-4 pb-4" style={{ color: '#666' }}>
              متصفحك لا يدعم الصوت — يعمل على Chrome وEdge
            </p>
          )}
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes ring {
          0%  { transform: scale(1);   opacity: 1 }
          100%{ transform: scale(1.35); opacity: 0 }
        }
        @keyframes wave {
          0%,100%{ height: 5px  }
          50%    { height: 28px }
        }
        @keyframes pulse {
          0%,100%{ opacity:1 }
          50%    { opacity:.3 }
        }
      `}</style>
    </>
  )
}
