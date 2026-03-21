"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Lang, getInitialLang, t as tFn, ta as taFn, formatDate as formatDateFn } from "./index";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  ta: (key: string) => string[];
  formatDate: (iso: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // SSR-safe default: always 'zh' on server, detect on client
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: (key, vars) => tFn(key, lang, vars),
    ta: (key) => taFn(key, lang),
    formatDate: (iso) => formatDateFn(iso, lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
