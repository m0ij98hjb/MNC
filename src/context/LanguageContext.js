"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ar } from '../locales/ar';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { de } from '../locales/de';
import { tr } from '../locales/tr';
import { ur } from '../locales/ur';
import { ru } from '../locales/ru';

const LanguageContext = createContext();

// All supported languages
export const LANGUAGES = [
  { code: 'ar', name: 'العربية',    nativeName: 'العربية',   flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English',    nativeName: 'English',   flag: '🇺🇸', dir: 'ltr' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',       flag: '🇨🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',   flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French',     nativeName: 'Français',  flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',   flag: '🇩🇪', dir: 'ltr' },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe',    flag: '🇹🇷', dir: 'ltr' },
  { code: 'ur', name: 'Urdu',       nativeName: 'اردو',      flag: '🇵🇰', dir: 'rtl' },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',   flag: '🇷🇺', dir: 'ltr' },
];

const localesMap = { ar, en, zh, es, fr, de, tr, ur, ru };

// Languages that use RTL direction
const RTL_LANGS = ['ar', 'ur'];

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState('ar');
  const [translations, setTranslations] = useState(ar);

  useEffect(() => {
    const savedLang = localStorage.getItem('mnc_lang');
    if (savedLang && localesMap[savedLang]) {
      setLangState(savedLang);
    }
  }, []);

  useEffect(() => {
    const isRTL = RTL_LANGS.includes(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('mnc_lang', lang);
    setTranslations(localesMap[lang] || en);
  }, [lang]);

  const setLang = (code) => {
    if (localesMap[code]) {
      setLangState(code);
    }
  };

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const isRTL = RTL_LANGS.includes(lang);

  // Translation function - supports dot notation (e.g. 'nav.home')
  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value !== undefined && value !== null ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isRTL, LANGUAGES }}>
      <div className={isRTL ? 'font-cairo' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
