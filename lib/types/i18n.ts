export type Lang = "en" | "ja";

export interface LocalizedString {
  en?: string;
  ja?: string;
}

export type Dictionary = Record<string, string>;

export function getLocalized(field: LocalizedString | undefined | null, lang: Lang): string {
  if (!field) return "";
  return field[lang] ?? field.en ?? field.ja ?? "";
}
