import { Promotion } from "@/lib/types/page";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";

interface PromotionBarProps {
  promotion: Promotion;
  lang: Lang;
}

export default function PromotionBar({ promotion, lang }: PromotionBarProps) {
  if (!promotion.enabled) return null;

  const text = getLocalized(promotion.text, lang);
  if (!text) return null;

  const direction = promotion.direction ?? "left";

  return (
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
  );
}
