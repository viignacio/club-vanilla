"use client";

import { useState, useEffect } from "react";
import type { AdminLang } from "@/lib/i18n/adminDict";

const STORAGE_KEY = "cv_admin_lang";

export function useAdminLang() {
  const [lang, setLangState] = useState<AdminLang>("ja");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as AdminLang | null;
    if (stored === "en" || stored === "ja") setLangState(stored);
  }, []);

  function setLang(l: AdminLang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return { lang, setLang };
}
