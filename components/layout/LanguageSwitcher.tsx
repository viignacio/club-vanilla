"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lang, LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  currentLang: Lang;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getHrefForLang(lang: Lang): string {
    const segments = pathname.split("/").filter(Boolean);
    // Replace the first segment (current lang) with the new lang
    if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as Lang)) {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }
    return `/${segments.join("/")}`;
  }

  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map((lang, i) => (
        <span key={lang} className="flex items-center">
          {i > 0 && <span className="text-brand-purple mx-1">|</span>}
          <Link
            href={getHrefForLang(lang)}
            className={`text-sm font-semibold tracking-wider transition-colors ${
              currentLang === lang
                ? "text-brand-pink"
                : "text-white/60 hover:text-white"
            }`}
          >
            {LOCALE_LABELS[lang]}
          </Link>
        </span>
      ))}
    </div>
  );
}
