"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Promotion } from "@/lib/types/page";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";

const PromotionContext = createContext<{ setShowForPage: (v: boolean) => void }>({
  setShowForPage: () => {},
});

export function usePromotionContext() {
  return useContext(PromotionContext);
}

interface Props {
  children: ReactNode;
  promotion: Promotion;
  lang: Lang;
}

export default function PromotionProvider({ children, promotion, lang }: Props) {
  const [showForPage, setShowForPage] = useState(false);

  const shouldShow = promotion.enabled || showForPage;
  const text = getLocalized(promotion.text, lang);
  const direction = promotion.direction ?? "left";

  return (
    <PromotionContext.Provider value={{ setShowForPage }}>
      {shouldShow && text && (
        <div
          className="fixed left-0 right-0 z-40 h-10 top-16 sm:top-20 overflow-hidden flex items-center"
          style={{
            background: "linear-gradient(to right, var(--color-brand-pink-dark), var(--color-brand-purple), var(--color-brand-navy-light))",
          }}
        >
          <span className={`whitespace-nowrap text-white text-sm font-semibold tracking-wide marquee-${direction}`}>
            {text}
          </span>
        </div>
      )}
      {children}
    </PromotionContext.Provider>
  );
}
