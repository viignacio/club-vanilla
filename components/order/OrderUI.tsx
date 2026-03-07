"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { OrderSession } from "@/lib/supabase/types";
import type { OrderMenuSection, OrderMenuItem } from "@/lib/types/order";
import type { CartItem } from "@/lib/supabase/types";

type Lang = "en" | "ja";
type View = "menu" | "cart" | "confirmation";

interface OrderUIProps {
  session: OrderSession;
  menuSections: OrderMenuSection[];
}

function loc(field: { en?: string; ja?: string } | undefined, lang: Lang): string {
  if (!field) return "";
  return (lang === "ja" ? field.ja : field.en) || field.en || field.ja || "";
}

function buildTabs(sections: OrderMenuSection[], lang: Lang) {
  const tabs: { key: string; label: string; items: OrderMenuItem[] }[] = [];
  for (const section of sections) {
    if (section.categories?.length) {
      for (const cat of section.categories) {
        const items = cat.items?.filter((i) => i.price > 0) ?? [];
        if (items.length) tabs.push({ key: cat._key, label: loc(cat.name, lang) || "Menu", items });
      }
    }
    const flatItems = section.items?.filter((i) => i.price > 0) ?? [];
    if (flatItems.length) {
      tabs.push({ key: section._key, label: loc(section.sectionHeading, lang) || "Menu", items: flatItems });
    }
  }
  return tabs;
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  tableName, lang, onLangToggle, cartCount, onCartOpen, view, onBack,
}: {
  tableName: string; lang: Lang; onLangToggle: () => void;
  cartCount: number; onCartOpen: () => void; view: View; onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-dark-900/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {view !== "menu" && (
            <button onClick={onBack} className="lg:hidden text-white/50 hover:text-white transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="min-w-0">
            <p className="font-bold text-base sm:text-lg leading-tight bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
              Club Vanilla
            </p>
            <p className="text-white/40 text-xs truncate">{tableName}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onLangToggle}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            {lang === "en" ? "日本語" : "English"}
          </button>
          {view === "menu" && (
            <button
              onClick={onCartOpen}
              className="lg:hidden relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-xs font-semibold hover:bg-brand-pink/20 transition-all"
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

// ─── Menu Item Card ───────────────────────────────────────────────────────────

function MenuItemCard({ item, lang, quantity, onAdd, onRemove }: {
  item: OrderMenuItem; lang: Lang; quantity: number; onAdd: () => void; onRemove: () => void;
}) {
  const name = loc(item.name, lang);
  const description = loc(item.description, lang);
  const taxLabel = item.taxIncluded ? (lang === "ja" ? "税込" : "Tax incl.") : "";

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      quantity > 0 ? "border-brand-pink/30 bg-brand-pink/5" : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
    }`}>
      {item.imageUrl && (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-white/5">
          <Image src={item.imageUrl} alt={name} fill className="object-cover" sizes="80px" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm sm:text-base leading-snug">{name}</p>
        {description && (
          <p className="text-white/40 text-xs mt-1 leading-snug line-clamp-2">{description}</p>
        )}
        <p className="text-brand-pink font-bold mt-1.5 text-sm sm:text-base">
          ¥{item.price.toLocaleString()}
          {taxLabel && <span className="text-white/30 text-xs font-normal ml-1">{taxLabel}</span>}
        </p>
      </div>
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
            <span className="text-white font-bold text-sm w-5 text-center tabular-nums">{quantity}</span>
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
    <div className="flex flex-col h-full">
      {/* Cart title — desktop only */}
      <div className="hidden lg:block px-6 py-5 border-b border-white/5">
        <h2 className="text-white font-bold text-lg">{t.title}</h2>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.98-7.065a48.108 48.108 0 00-3.476-.384M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium">{t.empty}</p>
          <p className="text-white/20 text-xs">{t.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
            {cart.map((item) => {
              const name = lang === "ja" ? (item.item_name_ja || item.item_name_en) : item.item_name_en;
              return (
                <div key={item.item_key} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug">{name}</p>
                    <p className="text-white/40 text-xs mt-0.5">¥{item.price.toLocaleString()} × {item.quantity}</p>
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

            <div className="pt-2">
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder={t.note} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 resize-none transition-colors" />
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-8 pt-4 border-t border-white/5 shrink-0">
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
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
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

export default function OrderUI({ session, menuSections }: OrderUIProps) {
  const [lang, setLang] = useState<Lang>("ja");
  const [view, setView] = useState<View>("menu");
  const [activeTabKey, setActiveTabKey] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = useMemo(() => buildTabs(menuSections, lang), [menuSections, lang]);
  const currentTabKey = activeTabKey ?? tabs[0]?.key ?? null;
  const currentItems = tabs.find((t) => t.key === currentTabKey)?.items ?? [];
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function getQty(key: string) { return cart.find((i) => i.item_key === key)?.quantity ?? 0; }

  function addToCart(item: OrderMenuItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.item_key === item._key);
      if (existing) return prev.map((i) => i.item_key === item._key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item_key: item._key, item_name_en: item.name.en, item_name_ja: item.name.ja ?? null, price: item.price, quantity: 1 }];
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
    const item = tabs.flatMap((t) => t.items).find((i) => i._key === key);
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
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <Header
        tableName={session.tableName} lang={lang}
        onLangToggle={() => setLang((l) => l === "en" ? "ja" : "en")}
        cartCount={cartCount} onCartOpen={() => setView("cart")}
        view={view} onBack={() => setView("menu")}
      />

      {/* Body */}
      <div className="flex-1 flex min-h-0 relative max-w-7xl w-full mx-auto">

        {/* ── Menu panel ── */}
        <div className={`flex flex-col flex-1 min-w-0 overflow-hidden ${view !== "menu" ? "hidden lg:flex" : "flex"}`}>
          {/* Category tabs */}
          {tabs.length > 1 && (
            <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar border-b border-white/5 shrink-0">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTabKey(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all ${
                    tab.key === currentTabKey
                      ? "bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-lg shadow-brand-pink/20"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-28 lg:pb-6 flex flex-col gap-2">
            {currentItems.length === 0 ? (
              <p className="text-white/20 text-sm text-center mt-16">
                {lang === "ja" ? "メニューがありません" : "No items available"}
              </p>
            ) : (
              currentItems.map((item) => (
                <MenuItemCard key={item._key} item={item} lang={lang}
                  quantity={getQty(item._key)}
                  onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item._key)} />
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
        <div className={`
          lg:w-[380px] lg:shrink-0 lg:border-l lg:border-white/5 lg:flex lg:flex-col
          ${view === "menu" ? "hidden lg:flex" : "flex flex-col flex-1"}
          ${view === "confirmation" ? "" : ""}
        `}>
          {view === "confirmation"
            ? <Confirmation lang={lang} onOrderMore={() => setView("menu")} />
            : <CartPanel cart={cart} lang={lang} onRemove={removeFromCart} onAdd={addByKey}
                onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          }
        </div>
      </div>
    </div>
  );
}
