"use client";

import Image from "next/image";
import { MenuSectionBlock, MenuItem, MenuCategory } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { urlFor } from "@/sanity/lib/image";

interface MenuSectionProps {
  block: MenuSectionBlock;
  lang: Lang;
}

function MenuItemCard({ item, lang, style }: { item: MenuItem; lang: Lang; style: "grid" | "list" }) {
  const name = getLocalized(item.name, lang);
  const description = getLocalized(item.description, lang);
  const basePrice = item.priceDisplay ?? (item.price != null ? `¥${item.price.toLocaleString()}` : null);
  const taxLabel = item.taxIncluded ? (lang === "ja" ? "（税込）" : " (Incl. Tax)") : "";
  const price = basePrice ? `${basePrice}${taxLabel}` : null;
  const imageUrl = item.image ? urlFor(item.image).width(400).height(300).url() : null;

  if (style === "grid") {
    return (
      <div className="bg-dark-800 rounded-xl overflow-hidden border border-brand-purple/10 hover:border-brand-pink/30 transition-colors group">
        {imageUrl && (
          <div className="relative h-40 overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-semibold text-white text-sm">{name}</p>
              {description && <p className="text-white/50 text-xs mt-1">{description}</p>}
            </div>
            {price && (
              <span className="text-brand-pink font-bold text-sm whitespace-nowrap">{price}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-brand-purple/10 last:border-0 hover:bg-dark-700/30 px-2 rounded transition-colors">
      <div className="flex items-center gap-3">
        {imageUrl && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={imageUrl} alt={name} fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div>
          <p className="text-white font-medium text-sm">{name}</p>
          {description && <p className="text-white/50 text-xs">{description}</p>}
        </div>
      </div>
      {price && (
        <span className="text-brand-pink font-bold text-sm ml-4 whitespace-nowrap">{price}</span>
      )}
    </div>
  );
}

function MenuItemsGroup({ items, lang, style }: { items: MenuItem[]; lang: Lang; style: "grid" | "list" }) {
  if (items.length === 0) return null;
  return (
    <div
      className={
        style === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          : "bg-dark-900/50 rounded-2xl p-4 sm:p-6 border border-brand-purple/10"
      }
    >
      {items.map((item) => (
        <MenuItemCard key={item._key} item={item} lang={lang} style={style} />
      ))}
    </div>
  );
}

function MenuCategoryGroup({ category, lang, style }: { category: MenuCategory; lang: Lang; style: "grid" | "list" }) {
  const name = getLocalized(category.name, lang);
  const items = category.items ?? [];
  return (
    <div>
      {name && (
        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-pink/80 mb-3 mt-6 first:mt-0">
          {name}
        </h3>
      )}
      <MenuItemsGroup items={items} lang={lang} style={style} />
    </div>
  );
}

export default function MenuSection({ block, lang }: MenuSectionProps) {
  const heading = getLocalized(block.sectionHeading, lang);
  const subheading = getLocalized(block.sectionSubheading, lang);
  const style = block.displayStyle ?? "list";
  const categories = block.categories ?? [];

  return (
    <section className="pt-16 sm:pt-24">
      <div className="block-container">
        <div className="bg-dark-800 rounded-2xl p-6 sm:p-10 border border-brand-purple/10">
          {(heading || subheading) && (
            <div className="text-center mb-10">
              {heading && (
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                    {heading}
                  </span>
                </h2>
              )}
              {subheading && (
                <p className="text-white/60 text-lg">{subheading}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {categories.map((category) => (
              <MenuCategoryGroup key={category._key} category={category} lang={lang} style={style} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
