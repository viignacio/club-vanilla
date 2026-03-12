"use client";

import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import type { Lang } from "@/lib/i18n/config";

interface LangSwitcherProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function LangSwitcher({ lang, setLang }: LangSwitcherProps) {
  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="text-brand-purple mx-1">|</span>}
          <button
            onClick={() => setLang(l)}
            className={`text-sm font-semibold tracking-wider transition-colors ${
              lang === l
                ? "text-brand-pink"
                : "text-white/60 hover:text-white"
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
