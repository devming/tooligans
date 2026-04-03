import React, { createContext, useContext, useState, useCallback } from 'react';
import en from './en.json';
import ko from './ko.json';
import zh from './zh.json';
import ja from './ja.json';

const TRANSLATIONS = { en, ko, zh, ja };

export const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'ko', flag: '🇰🇷', label: 'KO' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH' },
  { code: 'ja', flag: '🇯🇵', label: 'JA' },
];

const LanguageContext = createContext(null);

function getStoredLang() {
  try {
    const stored = localStorage.getItem('tooligans_lang');
    if (stored && TRANSLATIONS[stored]) return stored;
  } catch {}
  const browser = navigator.language.slice(0, 2).toLowerCase();
  return TRANSLATIONS[browser] ? browser : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang);

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return;
    setLangState(code);
    try { localStorage.setItem('tooligans_lang', code); } catch {}
  }, []);

  // t('json.status.formatted') — dot-path accessor
  const t = useCallback((key) => {
    const parts = key.split('.');
    let val = TRANSLATIONS[lang];
    for (const part of parts) {
      if (val == null) break;
      val = val[part];
    }
    if (val == null) {
      // fallback to English
      val = TRANSLATIONS.en;
      for (const part of parts) {
        if (val == null) break;
        val = val[part];
      }
    }
    return val ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
