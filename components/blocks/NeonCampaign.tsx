import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { NeonCampaignBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";

interface NeonCampaignProps {
  block: NeonCampaignBlock;
  lang: Lang;
}

const neonPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white text-xl sm:text-2xl font-bold leading-relaxed mb-3 last:mb-0 text-center">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    highlight: ({ children }) => (
      <span className="text-brand-pink">{children}</span>
    ),
  },
};

export default function NeonCampaign({ block, lang }: NeonCampaignProps) {
  const sectionTitle = getLocalized(block.sectionTitle, lang);
  const sectionSubtitle = getLocalized(block.sectionSubtitle, lang);
  const campaignLabel = getLocalized(block.campaignLabel, lang);
  const content = block.content?.[lang] ?? block.content?.en ?? [];

  return (
    <section className="pt-16 sm:pt-24">
      <div className="block-container">
        {/* Section header */}
        {sectionTitle && (
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-white">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="mt-2 text-sm text-white/50 tracking-[0.3em]">
                {sectionSubtitle}
              </p>
            )}
            <div className="mt-4 mx-auto w-20 h-0.5 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full" />
          </div>
        )}

        {/* Neon container */}
        {(campaignLabel || content.length > 0) && (
          <div className="neon-pulse rounded-2xl px-8 sm:px-12 py-10 bg-brand-pink/5 flex flex-col items-center gap-4">
            {campaignLabel && (
              <p className="text-brand-pink font-semibold text-base sm:text-lg tracking-wide text-center">
                {campaignLabel}
              </p>
            )}
            {content.length > 0 && (
              <PortableText value={content} components={neonPortableTextComponents} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
