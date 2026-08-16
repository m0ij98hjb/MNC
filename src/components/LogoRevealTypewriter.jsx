"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const noopSubscribe = () => () => {};
const getServerDir = () => false;

/**
 * LogoRevealTypewriter
 *
 * Same rhythm as TypewriterText (type → pause → delete → pause, looped),
 * but the second phrase is replaced by a progressive clip-path reveal of
 * the company logo, followed by a typed word.
 *
 * Cycle: type(firstText) → pause → delete → pause
 *        → reveal(logo) → type(word) → pause → delete(word) → hide(logo) → pause → loop
 */
export default function LogoRevealTypewriter({
  firstText,
  word,
  logoSrc,
  logoAlt = "MNC Construction",
  logoWidthClassName = "w-[150px] sm:w-[190px] md:w-[230px] lg:w-[280px]",
  typingSpeed = 120,
  deletingSpeed = 60,
  pauseDuration = 2500,
  revealDuration = 900,
  loop = true,
  cursor = true,
  cursorClassName = "animate-cursor-blink",
  className = "",
  textClassName = "text-white",
  wordClassName = "text-gradient",
}) {
  const [phase, setPhase] = useState("typing-text"); // typing-text | deleting-text | revealing-logo | typing-word | deleting-word | hiding-logo
  const [displayText, setDisplayText] = useState("");
  const [logoRevealed, setLogoRevealed] = useState(false);

  const timeoutRef = useRef(null);

  const isRTL = useSyncExternalStore(
    noopSubscribe,
    () => document.dir === "rtl",
    getServerDir
  );

  useEffect(() => {
    let active = true;
    const text = { current: "" };
    clearTimeout(timeoutRef.current);
    setPhase("typing-text");
    setDisplayText("");
    setLogoRevealed(false);

    const after = (fn, delay) => {
      timeoutRef.current = setTimeout(() => {
        if (active) fn();
      }, delay);
    };

    // Mount the (clipped) logo first, then flip it to revealed on the next
    // tick — a CSS transition needs a real "before" paint to animate from;
    // setting both in one render just pops it in at full size. Chained
    // through the same `after` timer (not requestAnimationFrame) so it
    // can't race the step that follows it.
    const revealLogo = (onDone) => {
      setPhase("revealing-logo");
      after(() => {
        setLogoRevealed(true);
        after(onDone, revealDuration);
      }, 20);
    };

    const typeStep = (full, speed, onDone) => {
      text.current = full.slice(0, text.current.length + 1);
      setDisplayText(text.current);
      if (text.current === full) {
        onDone();
      } else {
        after(() => typeStep(full, speed, onDone), speed);
      }
    };

    const deleteStep = (speed, onDone) => {
      text.current = text.current.slice(0, -1);
      setDisplayText(text.current);
      if (text.current === "") {
        onDone();
      } else {
        after(() => deleteStep(speed, onDone), speed);
      }
    };

    const run = () => {
      setPhase("typing-text");
      text.current = "";
      after(
        () =>
          typeStep(firstText, typingSpeed, () =>
            after(() => {
              setPhase("deleting-text");
              deleteStep(deletingSpeed, () =>
                after(() => {
                  revealLogo(() => {
                    setPhase("typing-word");
                    text.current = "";
                    typeStep(word, typingSpeed, () =>
                      after(() => {
                        setPhase("deleting-word");
                        deleteStep(deletingSpeed, () => {
                          setPhase("hiding-logo");
                          setLogoRevealed(false);
                          after(() => {
                            if (loop) run();
                          }, revealDuration + typingSpeed);
                        });
                      }, pauseDuration)
                    );
                  });
                }, typingSpeed)
              );
            }, pauseDuration)
          ),
        typingSpeed
      );
    };

    run();

    return () => {
      active = false;
      clearTimeout(timeoutRef.current);
    };
  }, [firstText, word, typingSpeed, deletingSpeed, pauseDuration, revealDuration, loop]);

  const showingWord = phase === "typing-word" || phase === "deleting-word";
  const clipRevealed = "inset(0 0 0 0)";
  const clipHidden = isRTL ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  return (
    <span className={`inline-flex items-center flex-wrap gap-x-4 gap-y-2 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      {phase === "typing-text" || phase === "deleting-text" ? (
        <span className={`whitespace-pre-wrap ${textClassName}`}>{displayText}</span>
      ) : (
        <>
          <span
            className={`relative inline-block align-middle ${logoWidthClassName}`}
            style={{
              aspectRatio: "1187 / 459",
              clipPath: logoRevealed ? clipRevealed : clipHidden,
              transition: `clip-path ${revealDuration}ms linear`,
            }}
          >
            {/* Authentic-logo-gold glow behind the mark, fades in with the reveal */}
            <span
              className="absolute inset-0 -z-10 rounded-full blur-2xl transition-opacity"
              style={{
                backgroundColor: "#FFA918",
                opacity: logoRevealed ? 0.12 : 0,
                transitionDuration: `${revealDuration}ms`,
              }}
              aria-hidden="true"
            />
            <Image src={logoSrc} alt={logoAlt} fill className="object-contain" priority />
          </span>
          {showingWord && (
            <span className={`whitespace-pre-wrap ${wordClassName}`}>{displayText}</span>
          )}
        </>
      )}
      {cursor && (phase === "typing-text" || phase === "deleting-text" || showingWord) && (
        <span
          className={`inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
