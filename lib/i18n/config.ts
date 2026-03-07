export const SUPPORTED_LOCALES = ["en", "ja"] as const;
export type Lang = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Lang = "en";

export const LOCALE_LABELS: Record<Lang, string> = {
  en: "EN",
  ja: "JP",
};

export const LOCALE_DISPLAY: Record<Lang, string> = {
  en: "English",
  ja: "日本語",
};

export function isValidLang(lang: string): lang is Lang {
  return SUPPORTED_LOCALES.includes(lang as Lang);
}
