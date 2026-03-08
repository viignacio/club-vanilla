"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem } from "@/lib/supabase/types";
import type { Table } from "@/lib/supabase/types";
import { adminDict } from "@/lib/i18n/adminDict";
import { useAdminLang } from "@/hooks/useAdminLang";
import { QRModal, type QRTable } from "@/components/admin/QRModal";

interface OrderFeedProps {
  initialOrders: Order[];
  tables: Pick<Table, "id" | "name" | "secret_key">[];
  logoUrl?: string;
}

function OrderCard({ order, onMarkDone, isUpdating, t }: {
  order: Order;
  onMarkDone: (id: string) => void;
  isUpdating: boolean;
  t: typeof adminDict["en"];
}) {
  const isPending = order.status === "pending";
  const tableName = order.table?.name ?? t.unknown;
  const items: OrderItem[] = order.items ?? [];

  return (
    <div className={`rounded-2xl border transition-all ${
      isPending
        ? "border-brand-pink/25 bg-gradient-to-b from-brand-pink/5 to-transparent"
        : "border-white/5 bg-white/[0.015] opacity-50"
    }`}>
      <div className={`flex items-center justify-between gap-2 px-4 py-3 border-b ${
        isPending ? "border-brand-pink/10" : "border-white/5"
      }`}>
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
              <span className="text-brand-pink text-xs font-bold uppercase tracking-widest">{t.pending}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-white/25 text-xs font-semibold uppercase tracking-widest">{t.done}</span>
            </span>
          )}
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white font-semibold text-sm">{tableName}</span>
        </div>
        <span className="text-white/25 text-xs tabular-nums">
          {t.timeAgo(Math.floor((Date.now() - new Date(order.created_at).getTime()) / 1000))}
        </span>
      </div>

      <div className="px-4 py-3 flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <span className="text-white/70 text-sm">
              {item.item_name_en}
              <span className="text-white/30 ml-1.5 text-xs">×{item.quantity}</span>
            </span>
            <span className="text-white/50 text-sm shrink-0 tabular-nums">
              ¥{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        {order.note && (
          <p className="text-white/35 text-xs bg-white/4 rounded-lg px-3 py-2 mt-1 italic border border-white/5">
            {order.note}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/5">
        <div>
          <p className="text-white/30 text-xs mb-0.5">{t.total}</p>
          <p className="text-white font-bold text-lg tabular-nums">¥{order.total.toLocaleString()}</p>
        </div>
        {isPending && (
          <button onClick={() => onMarkDone(order.id)} disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 text-white/70 text-sm font-semibold hover:bg-brand-pink hover:text-white transition-all disabled:opacity-40 border border-white/10 hover:border-brand-pink">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-12.75" />
            </svg>
            {t.markDone}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrderFeed({ initialOrders, tables, logoUrl }: OrderFeedProps) {
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTableId, setActiveTableId] = useState<string>("all");
  const [showDone, setShowDone] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [hasNew, setHasNew] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [qrTable, setQrTable] = useState<QRTable | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) return;
      const data = await res.json();
      const fetched: Order[] = data.orders ?? [];
      setOrders((prev) => {
        const prevPending = prev.filter((o) => o.status === "pending").length;
        const nextPending = fetched.filter((o) => o.status === "pending").length;
        if (nextPending > prevPending) setHasNew(true);
        return fetched;
      });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    pollRef.current = setInterval(fetchOrders, 10000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchOrders]);

  async function handleMarkDone(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      if (res.ok) setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "done" } : o));
    } finally { setUpdatingId(null); }
  }

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const filtered = orders.filter((o) => {
    const tableMatch = activeTableId === "all" || o.table_id === activeTableId;
    const statusMatch = showDone || o.status === "pending";
    return tableMatch && statusMatch;
  });

  const pendingCount = orders.filter((o) =>
    (activeTableId === "all" || o.table_id === activeTableId) && o.status === "pending"
  ).length;

  const doneCount = orders.filter((o) =>
    (activeTableId === "all" || o.table_id === activeTableId) && o.status === "done"
  ).length;

  const totalRevenue = orders
    .filter((o) => activeTableId === "all" || o.table_id === activeTableId)
    .reduce((sum, o) => sum + o.total, 0);

  const activeTableName = activeTableId === "all"
    ? t.allTables
    : (tables.find((t) => t.id === activeTableId)?.name ?? t.unknown);

  function navItem(active: boolean) {
    return `flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all text-left border ${
      active
        ? "bg-gradient-to-r from-brand-pink/15 to-brand-purple/15 text-white border-white/8"
        : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
    }`;
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5 shrink-0">
        {logoUrl ? (
          <Image src={logoUrl} alt="Club Vanilla" width={120} height={40} className="object-contain object-left max-h-10 w-auto mb-1" />
        ) : (
          <p className="font-bold text-lg bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent leading-tight">
            Club Vanilla
          </p>
        )}
        <p className="text-white/30 text-xs mt-0.5">{t.brandSubtitle}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto flex flex-col gap-6">
        <div>
          <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">{t.orders}</p>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => { setActiveTableId("all"); setMobileOpen(false); }}
              className={navItem(activeTableId === "all")}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {t.allTables}
            </button>
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => { setActiveTableId(table.id); setMobileOpen(false); }}
                className={navItem(activeTableId === table.id)}
              >
                <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                </span>
                {table.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">{t.management}</p>
          <div className="flex flex-col gap-0.5">
            <Link href="/admin/tables"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              {t.tableManagement}
            </Link>
          </div>
        </div>
      </nav>

      {/* Lang toggle + Logout */}
      <div className="px-3 py-4 border-t border-white/5 shrink-0 flex flex-col gap-1">
        <div className="flex gap-1 px-1 mb-1">
          {(["en", "ja"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                lang === l
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {l === "en" ? "EN" : "JP"}
            </button>
          ))}
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          {t.logout}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-dark-900 min-h-screen">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-pink/4 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-purple/4 rounded-full blur-3xl" />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-dark-800/60 border-r border-white/5 sticky top-0 h-screen overflow-y-auto z-10">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-dark-800 border-r border-white/8 flex flex-col h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-dark-900/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent leading-tight">
              Club Vanilla
            </p>
            <p className="text-white/30 text-xs">{t.orderManagement}</p>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-5 sm:px-8 py-6 sm:py-8">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-7">
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">{activeTableName}</h1>
              <p className="text-white/30 text-sm mt-0.5">{t.liveOrderFeed}</p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:shrink-0">
              <button
                onClick={() => setShowDone((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  showDone
                    ? "bg-white/8 border-white/12 text-white/70"
                    : "bg-white/5 border-white/8 text-white/40 hover:bg-white/8 hover:text-white/60"
                }`}>
                <div className={`relative w-7 h-4 rounded-full transition-colors shrink-0 ${showDone ? "bg-brand-purple/60" : "bg-white/10"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showDone ? "translate-x-3.5" : "translate-x-0.5"}`} />
                </div>
                {t.showCompleted}
              </button>
              {activeTableId !== "all" && (() => {
                const table = tables.find((tb) => tb.id === activeTableId);
                return table ? (
                  <button
                    onClick={() => setQrTable(table)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 text-xs font-semibold hover:bg-brand-pink/15 hover:text-brand-pink hover:border-brand-pink/30 transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                    {t.qrCode}
                  </button>
                ) : null;
              })()}
              {hasNew && (
                <button onClick={() => setHasNew(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-pink/15 border border-brand-pink/30 text-brand-pink text-xs font-semibold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                  {t.newOrders}
                </button>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className={`rounded-2xl border p-4 sm:p-5 transition-all overflow-hidden min-w-0 ${
              pendingCount > 0
                ? "border-brand-pink/30 bg-gradient-to-br from-brand-pink/10 to-brand-pink/3"
                : "border-white/8 bg-white/[0.03]"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse shrink-0" />}
                <p className="text-white/30 text-xs font-medium truncate">{t.pending}</p>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${
                pendingCount > 0 ? "text-brand-pink" : "text-white/25"
              }`}>{pendingCount}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5 overflow-hidden min-w-0">
              <div className="mb-3">
                <p className="text-white/30 text-xs font-medium truncate">{t.completed}</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums leading-none text-white">{doneCount}</p>
            </div>

            <div className="rounded-2xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/8 to-transparent p-4 sm:p-5 overflow-hidden min-w-0">
              <div className="mb-3">
                <p className="text-white/30 text-xs font-medium truncate">{t.revenue}</p>
              </div>
              <p className="text-base sm:text-2xl lg:text-3xl font-bold tabular-nums leading-none text-brand-purple-light">
                ¥{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Orders */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <p className="text-white/30 font-medium">
                  {pendingCount === 0 ? t.noPendingOrders : t.noOrdersMatchFilter}
                </p>
                <p className="text-white/15 text-sm mt-1">{t.ordersWillAppear}</p>
              </div>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 space-y-4">
              {filtered.map((order) => (
                <div key={order.id} className="break-inside-avoid">
                  <OrderCard order={order} onMarkDone={handleMarkDone} isUpdating={updatingId === order.id} t={t} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {qrTable && <QRModal table={qrTable} onClose={() => setQrTable(null)} t={t} />}
    </div>
  );
}
