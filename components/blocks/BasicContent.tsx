import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { BasicContentBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface BasicContentProps {
  block: BasicContentBlock;
  lang: Lang;
}

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white/70 text-base sm:text-lg leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-white/90">{children}</em>,
    underline: ({ children }) => (
      <span className="underline decoration-brand-pink underline-offset-2">{children}</span>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-brand-pink underline underline-offset-2 hover:text-brand-pink-light transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 text-white/70">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-white/70">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

const bgMap: Record<string, string> = {
  dark: "bg-dark-900",
  pink: "bg-gradient-to-br from-dark-900 to-brand-pink/10",
  purple: "bg-gradient-to-br from-dark-900 to-brand-purple/10",
};

export default function BasicContent({ block, lang }: BasicContentProps) {
  const heading = getLocalized(block.heading, lang);
  const body = block.body?.[lang] ?? block.body?.en ?? [];
  const ctaLabel = getLocalized(block.ctaButton?.label, lang);
  const imagePosition = block.imagePosition ?? "right";
  const imageCenter = imagePosition === "center";
  const imageLeft = imagePosition === "left";
  const bgClass = bgMap[block.backgroundColor ?? "dark"] ?? bgMap.dark;
  const alignment = block.contentAlignment ?? "left";

  const textAlignClass =
    alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";
  const itemsAlignClass =
    alignment === "center" ? "items-center" : alignment === "right" ? "items-end" : "items-start";

  const imageUrl = block.image
    ? urlFor(block.image).width(800).height(600).url()
    : null;

  return (
    <section className={`${bgClass} pt-16 sm:pt-24`}>
      <div className="block-container">
        {imageCenter ? (
          /* Center layout: image full-width stacked above text */
          <div className="flex flex-col gap-8">
            {imageUrl && (
              <div className="w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl shadow-brand-purple/20 ring-1 ring-brand-purple/20">
                  <Image
                    src={imageUrl}
                    alt={heading || ""}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
                </div>
              </div>
            )}
            <div className={`w-full flex flex-col gap-6 ${textAlignClass} ${itemsAlignClass}`}>
              {heading && (
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                    {heading}
                  </span>
                </h2>
              )}
              {body.length > 0 && (
                <div className="flex flex-col gap-3">
                  <PortableText value={body} components={bodyComponents} />
                </div>
              )}
              {ctaLabel && block.ctaButton?.href && (
                <Link
                  href={block.ctaButton.href}
                  className="inline-block px-6 py-3 rounded-full border border-brand-pink text-brand-pink font-semibold text-sm tracking-widest uppercase hover:bg-brand-pink hover:text-white transition-all"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* Left / Right layout: side-by-side */
          <div
            className={`flex flex-col ${
              imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-12 lg:gap-16 items-center`}
          >
            {imageUrl && (
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl shadow-brand-purple/20 ring-1 ring-brand-purple/20">
                  <Image
                    src={imageUrl}
                    alt={heading || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
                </div>
              </div>
            )}
            <div className={`${imageUrl ? "w-full lg:w-1/2" : "w-full max-w-2xl mx-auto"} flex flex-col gap-6 ${textAlignClass} ${itemsAlignClass}`}>
              {heading && (
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                    {heading}
                  </span>
                </h2>
              )}
              {body.length > 0 && (
                <div className="flex flex-col gap-3">
                  <PortableText value={body} components={bodyComponents} />
                </div>
              )}
              {ctaLabel && block.ctaButton?.href && (
                <Link
                  href={block.ctaButton.href}
                  className="inline-block px-6 py-3 rounded-full border border-brand-pink text-brand-pink font-semibold text-sm tracking-widest uppercase hover:bg-brand-pink hover:text-white transition-all"
                >
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Google Maps embed — full container width below content */}
        {block.googleMapsUrl && (
          <div className="mt-10 sm:mt-12 rounded-2xl overflow-hidden aspect-video ring-1 ring-brand-purple/20">
            <iframe
              src={block.googleMapsUrl}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full h-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
