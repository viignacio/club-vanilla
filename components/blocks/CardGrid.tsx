import Image from "next/image";
import { CardGridBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface CardGridProps {
  block: CardGridBlock;
  lang: Lang;
}

export default function CardGrid({ block, lang }: CardGridProps) {
  const headline = getLocalized(block.sectionHeadline, lang);
  const subheadline = getLocalized(block.sectionSubheadline, lang);
  const columns = block.columns ?? 3;
  const items = block.items ?? [];

  const gridClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-3";


  return (
    <section className="bg-dark-900 pt-16 sm:pt-24">
      <div className="block-container">
        {/* Section header */}
        {(headline || subheadline) && (
          <div className="text-center mb-12">
            {headline && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-widest uppercase text-white mb-2">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-white/50 text-sm tracking-widest mb-4">{subheadline}</p>
            )}
            <div className="w-16 h-0.5 bg-gradient-to-r from-brand-pink to-brand-purple mx-auto" />
          </div>
        )}

        {/* Card grid */}
        <div className={`grid ${gridClass} gap-4 sm:gap-6`}>
          {items.map((item) => {
            const cardHeadline = getLocalized(item.headline, lang);
            const cardSubheadline = getLocalized(item.subheadline, lang);
            const cardBody = getLocalized(item.body, lang);
            const iconUrl = item.iconImage?.asset?.url
              ? item.iconImage.asset.url
              : item.iconImage?.asset?._ref
                ? urlFor(item.iconImage).width(80).url()
                : null;

            return (
              <div
                key={item._key}
                className="bg-dark-800/80 border border-brand-purple/20 rounded-2xl p-8 flex flex-col items-center text-center h-full"
              >
                {/* Icon — 48px gap below */}
                {iconUrl ? (
                  <div className="mb-12 flex items-center justify-center">
                    <Image
                      src={iconUrl}
                      alt={cardHeadline ?? ""}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                ) : item.iconEmoji ? (
                  <div className="mb-12 text-4xl leading-none">{item.iconEmoji}</div>
                ) : null}

                {/* Headline + Subheadline group — 8px between them */}
                {(cardHeadline || cardSubheadline) && (
                  <div className="flex flex-col items-center">
                    {cardHeadline && (
                      <h3 className="text-lg sm:text-xl font-bold text-white">{cardHeadline}</h3>
                    )}
                    {cardSubheadline && (
                      <p className="text-brand-pink text-sm font-medium mt-2">{cardSubheadline}</p>
                    )}
                  </div>
                )}

                {/* Body — 16px gap above when text content exists, flush when icon-only */}
                {cardBody && (
                  <p className={`text-white/60 text-sm sm:text-base leading-relaxed whitespace-pre-line ${cardHeadline || cardSubheadline ? "mt-4" : ""}`}>
                    {cardBody}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
