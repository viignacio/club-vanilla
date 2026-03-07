"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { ImagePairWithContentBlock, ImagePairCard } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface ImagePairWithContentProps {
  block: ImagePairWithContentBlock;
  lang: Lang;
}

const subtitleComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white/70 text-sm sm:text-base leading-relaxed">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-white/90">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-brand-pink underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
};

const helperTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white/75 text-sm sm:text-base leading-relaxed">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

function Card({
  card,
  lang,
  alignClass,
  textAlignClass,
}: {
  card: ImagePairCard;
  lang: Lang;
  alignClass: string;
  textAlignClass: string;
}) {
  const heading = getLocalized(card.heading, lang);
  const subheading = getLocalized(card.subheading, lang);
  const helperText = card.helperText?.[lang] ?? card.helperText?.en ?? [];
  const taxLabel = card.taxIncluded
    ? lang === "ja"
      ? "（税込）"
      : "(Tax included)"
    : "";

  const imageUrl = card.image ? urlFor(card.image).width(900).url() : null;
  const overlayStrength = card.overlayStrength ?? "dark";

  return (
    <div className="relative overflow-hidden rounded-2xl w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={heading || ""}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}

      {/* Dark overlay */}
      {overlayStrength !== "none" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(13, 11, 30, ${
              overlayStrength === "light" ? 0.35 :
              overlayStrength === "dark" ? 0.75 :
              0.85
            })`
          }}
        />
      )}

      {/* Content — absolutely centered within image bounds */}
      <div className={`absolute inset-0 z-10 flex items-center px-8 sm:px-10 ${alignClass}`}>
        <div className={`flex flex-col gap-3 max-w-sm ${textAlignClass}`}>
          {heading && (
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {heading}
            </h3>
          )}

          {subheading && (
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-brand-pink">
              {subheading}
            </p>
          )}

          {card.price != null && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                ¥{card.price.toLocaleString()}
              </span>
              {taxLabel && (
                <span className="text-xs sm:text-sm text-white/60">
                  {taxLabel}
                </span>
              )}
            </div>
          )}

          {helperText.length > 0 && (
            <div className="mt-1">
              <PortableText value={helperText} components={helperTextComponents} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImagePairWithContent({ block, lang }: ImagePairWithContentProps) {
  const alignment = block.contentAlignment ?? "center";
  const items = block.items ?? [];
  const subtitleContent = block.subtitle?.[lang] ?? block.subtitle?.en ?? [];

  const alignClass =
    alignment === "left"
      ? "justify-start"
      : alignment === "right"
        ? "justify-end"
        : "justify-center";

  const textAlignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const subtitleAlignClass =
    alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center";

  return (
    <section className="pt-16 sm:pt-24">
      <div className="block-container">
        {/* Card pair */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {items.map((card) => (
            <Card
              key={card._key}
              card={card}
              lang={lang}
              alignClass={alignClass}
              textAlignClass={textAlignClass}
            />
          ))}
        </div>

        {/* Subtitle below cards */}
        {subtitleContent.length > 0 && (
          <div className={`mt-8 sm:mt-10 ${subtitleAlignClass}`}>
            <PortableText value={subtitleContent} components={subtitleComponents} />
          </div>
        )}
      </div>
    </section>
  );
}
