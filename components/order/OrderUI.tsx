"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import type { OrderSession } from "@/lib/supabase/types";
import type { OrderMenuCategory, OrderMenuItem } from "@/lib/types/order";
import type { CartItem } from "@/lib/supabase/types";
import LangSwitcher from "@/components/LangSwitcher";

type Lang = "en" | "ja";
type View = "menu" | "cart" | "confirmation";

interface OrderUIProps {
  session: OrderSession;
  categories: OrderMenuCategory[];
  logoUrl?: string;
}

interface Section {
  key: string;
  label: string;
  items: OrderMenuItem[];
}

function loc(field: { en?: string; ja?: string } | undefined, lang: Lang): string {
  if (!field) return "";
  return (lang === "ja" ? field.ja : field.en) || field.en || field.ja || "";
}

function buildSections(categories: OrderMenuCategory[], lang: Lang): Section[] {
  return categories
    .map((cat) => ({
      key: cat._key,
      label: loc(cat.name, lang) || "Menu",
      items: cat.items?.filter((i) => i.price > 0 || i.unavailable) ?? [],
    }))
    .filter((s) => s.items.length > 0);
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  tableName, lang, setLang, cartCount, onCartOpen, view, onBack, logoUrl,
}: {
  tableName: string; lang: Lang; setLang: (l: Lang) => void;
  cartCount: number; onCartOpen: () => void; view: View; onBack: () => void;
  logoUrl?: string;
}) {
  return (
    <header className="sticky top-0 z-20 bg-dark-900/95 backdrop-blur-md border-b border-white/5 shrink-0">
      <div className="flex items-center justify-between gap-4 px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {view !== "menu" && (
            <button onClick={onBack} className="lg:hidden text-white/50 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              <Image src={logoUrl} alt="Club Vanilla" width={90} height={32} className="object-contain max-h-8 w-auto shrink-0" />
            ) : (
              <p className="font-bold text-base leading-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent shrink-0">
                Club Vanilla
              </p>
            )}
            <span className="text-white/15 shrink-0">|</span>
            <span className="text-white/50 text-sm font-medium truncate">{tableName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LangSwitcher lang={lang} setLang={setLang} />
          {view === "menu" && (
            <button
              onClick={onCartOpen}
              className="lg:hidden relative flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-xs font-semibold hover:bg-brand-pink/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.98-7.065a48.108 48.108 0 00-3.476-.384M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-pink rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Category Dropdown ────────────────────────────────────────────────────────

function CategoryDropdown({ sections, activeSectionKey, onSelect }: {
  sections: Section[];
  activeSectionKey: string | null;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeSection = sections.find((s) => s.key === activeSectionKey) ?? sections[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    // Outer: padding + border. Matches card's top spacing on desktop.
    <div className="px-4 py-4 border-b border-white/5 shrink-0 bg-dark-900">
      {/* Inner relative wrapper so dropdown is anchored to the button width exactly */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm font-semibold hover:border-white/20 transition-all"
        >
          <span>{activeSection?.label ?? "—"}</span>
          <svg
            className={`w-4 h-4 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          // left-0 right-0 relative to the inner wrapper = same width as the button
          <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-white/10 bg-dark-800 shadow-2xl overflow-hidden">
            {sections.map((section, i) => (
              <button
                key={section.key}
                onClick={() => { onSelect(section.key); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left transition-colors ${
                  i > 0 ? "border-t border-white/5" : ""
                } ${
                  section.key === activeSectionKey
                    ? "bg-brand-pink/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{section.label}</span>
                {section.key === activeSectionKey && (
                  <svg className="w-4 h-4 text-brand-pink shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-12.75" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Menu Item Card ───────────────────────────────────────────────────────────

function MenuItemCard({ item, lang, quantity, onAdd, onRemove }: {
  item: OrderMenuItem; lang: Lang; quantity: number; onAdd: () => void; onRemove: () => void;
}) {
  const name = loc(item.name, lang);
  const description = loc(item.description, lang);
  const taxLabel = item.taxIncluded ? (lang === "ja" ? "税込" : "Tax incl.") : "";
  const isUnavailable = item.unavailable === true;
  const unavailableLabel = lang === "ja" ? "品切れ" : "Unavailable";

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      isUnavailable
        ? "border-white/5 bg-white/[0.02] opacity-50"
        : quantity > 0
          ? "border-brand-pink/30 bg-brand-pink/5"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
    }`}>
      {item.imageUrl && (
        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-white/5">
          <Image src={item.imageUrl} alt={name} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug">{name}</p>
        {description && (
          <p className="text-white/40 text-xs mt-1 leading-snug line-clamp-2">{description}</p>
        )}
        {isUnavailable ? (
          <p className="text-white/40 font-medium mt-2 text-sm">{unavailableLabel}</p>
        ) : (
          <p className="text-brand-pink font-bold mt-2 text-sm">
            ¥{item.price.toLocaleString()}
            {taxLabel && <span className="text-white/30 text-xs font-normal ml-1">{taxLabel}</span>}
          </p>
        )}
      </div>
      {!isUnavailable && (
        <div className="flex items-center gap-2 shrink-0">
          {quantity > 0 && (
            <>
              <button
                onClick={onRemove}
                className="w-8 h-8 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                </svg>
              </button>
              <span className="text-white font-bold text-sm w-4 text-center tabular-nums">{quantity}</span>
            </>
          )}
          <button
            onClick={onAdd}
            className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center hover:bg-brand-pink-dark transition-colors shadow-lg shadow-brand-pink/20"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────

function CartPanel({ cart, lang, onRemove, onAdd, onSubmit, isSubmitting }: {
  cart: CartItem[]; lang: Lang;
  onRemove: (key: string) => void; onAdd: (key: string) => void;
  onSubmit: (note: string) => void; isSubmitting: boolean;
}) {
  const [note, setNote] = useState("");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const t = {
    title: lang === "ja" ? "ご注文内容" : "Your Order",
    empty: lang === "ja" ? "カートが空です" : "Your cart is empty",
    emptyHint: lang === "ja" ? "メニューからお選びください" : "Add items from the menu",
    note: lang === "ja" ? "備考・アレルギーなど（任意）" : "Notes or allergies (optional)",
    total: lang === "ja" ? "合計" : "Total",
    place: lang === "ja" ? "注文する" : "Place Order",
    placing: lang === "ja" ? "送信中..." : "Placing order...",
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Title */}
      <div className="px-4 py-4 border-b border-white/5 shrink-0">
        <h2 className="text-white font-bold text-base">{t.title}</h2>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center min-h-0">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.98-7.065a48.108 48.108 0 00-3.476-.384M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium">{t.empty}</p>
          <p className="text-white/20 text-xs">{t.emptyHint}</p>
        </div>
      ) : (
        <>
          {/* Items — scrollable, shrinks to leave room for CTA */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 flex flex-col gap-2">
            {cart.map((item) => {
              const name = lang === "ja" ? (item.item_name_ja || item.item_name_en) : item.item_name_en;
              return (
                <div key={item.item_key} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03]">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug">{name}</p>
                    <p className="text-white/40 text-xs mt-1">¥{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => onRemove(item.item_key)}
                      className="w-7 h-7 rounded-full border border-white/15 text-white/60 flex items-center justify-center hover:border-brand-pink hover:text-brand-pink transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                      </svg>
                    </button>
                    <span className="text-white font-semibold text-sm w-4 text-center tabular-nums">{item.quantity}</span>
                    <button onClick={() => onAdd(item.item_key)}
                      className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center hover:bg-brand-pink-dark transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-white/70 text-sm font-semibold w-16 text-right shrink-0 tabular-nums">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              );
            })}

            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={t.note} rows={3}
              className="w-full px-4 py-3 mt-2 rounded-xl bg-white/5 border border-white/8 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 resize-none transition-colors"
            />
          </div>

          {/* Total + CTA — always pinned at bottom */}
          <div className="px-4 py-4 border-t border-white/5 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm">{t.total}</span>
              <span className="text-white text-2xl font-bold tabular-nums">¥{total.toLocaleString()}</span>
            </div>
            <button onClick={() => onSubmit(note)} disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-brand-pink/20">
              {isSubmitting ? t.placing : t.place}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

function Confirmation({ lang, onOrderMore }: { lang: Lang; onOrderMore: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 flex items-center justify-center ring-1 ring-brand-pink/30">
          <svg className="w-9 h-9 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-12.75" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-brand-pink/10 blur-xl" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          {lang === "ja" ? "ご注文ありがとうございます！" : "Order placed!"}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
          {lang === "ja" ? "スタッフがまもなくお届けします。" : "Our staff will serve you shortly."}
        </p>
      </div>
      <button onClick={onOrderMore}
        className="px-8 py-3 rounded-full border border-brand-pink/50 text-brand-pink font-semibold text-sm hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all">
        {lang === "ja" ? "追加注文する" : "Order more"}
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OrderUI({ session, categories, logoUrl }: OrderUIProps) {
  const [lang, setLang] = useState<Lang>("ja");
  const [view, setView] = useState<View>("menu");
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = useMemo(() => buildSections(categories, lang), [categories, lang]);
  const currentSectionKey = activeSectionKey ?? sections[0]?.key ?? null;
  const currentItems = sections.find((s) => s.key === currentSectionKey)?.items ?? [];
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function getQty(key: string) { return cart.find((i) => i.item_key === key)?.quantity ?? 0; }

  function addToCart(item: OrderMenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.item_key === item._key);
      if (existing) return prev.map((i) => i.item_key === item._key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item_key: item._key, item_name_en: item.name.en || item.name.ja || "", item_name_ja: item.name.ja ?? null, price: item.price, quantity: 1 }];
    });
  }

  function removeFromCart(key: string) {
    setCart((prev) => {
      const existing = prev.find((i) => i.item_key === key);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.item_key !== key);
      return prev.map((i) => i.item_key === key ? { ...i, quantity: i.quantity - 1 } : i);
    });
  }

  function addByKey(key: string) {
    const item = sections.flatMap((s) => s.items).find((i) => i._key === key);
    if (item) addToCart(item);
  }

  async function handleSubmit(note: string) {
    if (!cart.length) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, note: note || null }),
      });
      if (res.ok) { setCart([]); setView("confirmation"); }
      else alert(lang === "ja" ? "注文に失敗しました。もう一度お試しください。" : "Failed to place order. Please try again.");
    } catch {
      alert(lang === "ja" ? "エラーが発生しました。" : "An error occurred.");
    } finally { setIsSubmitting(false); }
  }

  return (
    // h-dvh locks the layout to the viewport — prevents the cart CTA from scrolling off-screen
    <div className="h-dvh bg-dark-900 flex flex-col overflow-hidden">
      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <Header
        tableName={session.tableName} lang={lang}
        setLang={setLang}
        cartCount={cartCount} onCartOpen={() => setView("cart")}
        view={view} onBack={() => setView("menu")}
        logoUrl={logoUrl}
      />

      {/* Body — fills remaining viewport height, no overflow */}
      <div className="flex-1 flex min-h-0 relative max-w-7xl w-full mx-auto">

        {/* ── Menu panel ── */}
        <div className={`flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden ${view !== "menu" ? "hidden lg:flex" : "flex"}`}>

          {/* Category dropdown */}
          {sections.length > 1 && (
            <CategoryDropdown
              sections={sections}
              activeSectionKey={currentSectionKey}
              onSelect={(key) => setActiveSectionKey(key)}
            />
          )}

          {/* Items — scrollable within panel */}
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-4 py-4 pb-32 lg:pb-8 flex flex-col gap-2">
            {currentItems.length === 0 ? (
              <p className="text-white/20 text-sm text-center mt-16">
                {lang === "ja" ? "メニューがありません" : "No items available"}
              </p>
            ) : (
              currentItems.map((item) => (
                <MenuItemCard
                  key={item._key} item={item} lang={lang}
                  quantity={getQty(item._key)}
                  onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item._key)}
                />
              ))
            )}
          </div>

          {/* Mobile sticky cart bar */}
          {cartCount > 0 && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-dark-900/95 backdrop-blur-md border-t border-white/5">
              <button onClick={() => setView("cart")}
                className="w-full py-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold text-sm flex items-center justify-between px-5 hover:opacity-90 transition-all shadow-lg shadow-brand-pink/20">
                <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums">{cartCount}</span>
                <span>{lang === "ja" ? "注文内容を確認する" : "Review Order"}</span>
                <span className="tabular-nums">¥{cartTotal.toLocaleString()}</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Cart / Confirmation panel ── */}
        {/* Desktop: floating card, always visible alongside menu */}
        {/* Mobile: full-screen overlay when view === "cart" */}
        <div className={`
          lg:w-2/5 lg:flex-none lg:flex lg:flex-col lg:min-h-0 lg:py-4 lg:pr-4 lg:pl-3
          ${view === "menu" ? "hidden lg:flex" : "flex flex-col flex-1 min-h-0"}
        `}>
          <div className="flex flex-col flex-1 min-h-0 lg:rounded-2xl lg:border lg:border-white/8 lg:bg-white/[0.02] lg:overflow-hidden">
            {view === "confirmation"
              ? <Confirmation lang={lang} onOrderMore={() => setView("menu")} />
              : <CartPanel cart={cart} lang={lang} onRemove={removeFromCart} onAdd={addByKey}
                  onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
