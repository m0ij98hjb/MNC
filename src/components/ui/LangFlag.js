"use client";

// SVG flags for the language picker. Emoji flags (🇸🇦) render as plain
// letters on Windows, so the picker uses real artwork instead.
import SA from "country-flag-icons/react/3x2/SA";
import US from "country-flag-icons/react/3x2/US";
import CN from "country-flag-icons/react/3x2/CN";
import ES from "country-flag-icons/react/3x2/ES";
import FR from "country-flag-icons/react/3x2/FR";
import DE from "country-flag-icons/react/3x2/DE";
import TR from "country-flag-icons/react/3x2/TR";
import PK from "country-flag-icons/react/3x2/PK";
import RU from "country-flag-icons/react/3x2/RU";
import IN from "country-flag-icons/react/3x2/IN";

const FLAGS = { ar: SA, en: US, zh: CN, es: ES, fr: FR, de: DE, tr: TR, ur: PK, ru: RU, hi: IN };

export default function LangFlag({ code, className = "w-5" }) {
  const Flag = FLAGS[code];
  if (!Flag) return null;
  return (
    <Flag
      aria-hidden="true"
      className={`${className} h-auto shrink-0 rounded-[3px] ring-1 ring-black/10 shadow-sm`}
    />
  );
}
