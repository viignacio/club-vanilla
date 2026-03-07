"use client";

import Image from "next/image";
import { ImageWithContentBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface ImageWithContentProps {
  block: ImageWithContentBlock;
  lang: Lang;
}

export default function ImageWithContent({ block, lang }: ImageWithContentProps) {
  const headline = getLocalized(block.headline, lang);
  const subheading = getLocalized(block.subheading, lang);
  const helperText = getLocalized(block.helperText, lang);
  const ctaLabel = getLocalized(block.ctaButton?.label, lang);
  const marqueeText = getLocalized(block.marquee?.text, lang);
  const marqueeDirection = block.marquee?.direction ?? "left";
  const alignment = block.contentAlignment ?? "center";

  const bgUrl = block.backgroundImage
    ? urlFor(block.backgroundImage).width(1920).url()
    : null;
  const bgLqip = block.backgroundImage?.asset?.metadata?.lqip;

  const logoUrl = block.logo
    ? urlFor(block.logo).height(160).url()
    : null;
  const logoLqip = block.logo?.asset?.metadata?.lqip;

  const alignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const justifyClass =
    alignment === "left"
      ? "justify-start"
      : alignment === "right"
        ? "justify-end"
        : "justify-center";

  const ctaAlignClass =
    alignment === "left"
      ? "self-start"
      : alignment === "right"
        ? "self-end"
        : "self-center";

  return (
    <section className="pt-16 sm:pt-24">
      <div className="block-container">
        {/* Marquee strip — above the image */}
        {marqueeText && (
          <div className="h-16 sm:h-24 overflow-hidden flex items-center bg-dark-800/80 backdrop-blur-sm rounded-t-2xl opacity-50">
            <div className={`marquee-loop-${marqueeDirection}`}>
              <span className="whitespace-nowrap text-white/50 text-[30px] sm:text-[60px] font-semibold tracking-[0.3em] uppercase pr-24">{marqueeText}</span>
              <span className="whitespace-nowrap text-white/50 text-[30px] sm:text-[60px] font-semibold tracking-[0.3em] uppercase pr-24" aria-hidden="true">{marqueeText}</span>
            </div>
          </div>
        )}

        {/* Image with overlaid content */}
        <div className={`relative overflow-hidden min-h-[125vw] sm:min-h-[40vw] ${marqueeText ? "rounded-b-2xl" : "rounded-2xl"}`}>
          {/* Background image */}
          {bgUrl ? (
            <Image
              src={bgUrl}
              alt={headline}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
              placeholder={bgLqip ? "blur" : "empty"}
              blurDataURL={bgLqip}
            />
          ) : null}

          {/* Dark overlay */}
          {(block.overlayStrength ?? "none") !== "none" && (
            <div className={`absolute inset-0 ${
              block.overlayStrength === "light" ? "bg-dark-900/35" :
              block.overlayStrength === "dark" ? "bg-dark-900/75" :
              "bg-dark-900/85"
            }`} />
          )}

          {/* Content — absolutely fills image bounds so content centers vertically */}
          <div className={`absolute inset-0 z-10 flex items-center px-8 sm:px-12 ${justifyClass}`}>
            <div className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
              {/* Headline / eyebrow */}
              {headline && (
                <p className="text-xs sm:text-sm font-bold tracking-[0.4em] uppercase text-white/70">
                  {headline}
                </p>
              )}

              {/* Logo */}
              {logoUrl && (
                <div className="relative w-44 sm:w-64 h-20 sm:h-28 my-2">
                  <Image
                    src={logoUrl}
                    alt={headline}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 176px, 256px"
                    placeholder={logoLqip ? "blur" : "empty"}
                    blurDataURL={logoLqip}
                  />
                </div>
              )}

              {/* Subheading */}
              {subheading && (
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg">
                  {subheading}
                </p>
              )}

              {/* Helper text */}
              {helperText && (
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                  {helperText}
                </p>
              )}

              {/* CTA */}
              {ctaLabel && block.ctaButton?.href && (
                <a
                  href={block.ctaButton.href}
                  className={`inline-block mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-pink/30 ${ctaAlignClass}`}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
