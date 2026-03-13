"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminLang } from "@/hooks/useAdminLang";
import { adminDict } from "@/lib/i18n/adminDict";
import type { Order, OrderItem } from "@/lib/supabase/types";

const PAGE_SIZE = 20;

function currentBusinessDate(): string {
  const shifted = new Date(Date.now() - 11 * 60 * 60 * 1000);
  return shifted.toISOString().split("T")[0];
}

function formatTimeJST(isoStr: string): string {
  const date = new Date(isoStr);
  const h = (date.getUTCHours() + 9) % 24;
  const m = date.getUTCMinutes();
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatCurrency(v: number): string {
  return `¥${v.toLocaleString()}`;
}

export default function OrderHistory({
  logoUrl,
  username,
  role = "admin",
}: {
  logoUrl?: string;
  username?: string;
  role?: "admin" | "crew";
}) {
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(currentBusinessDate);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async (date: string) => {
    setLoading(true);
    setOrders([]);
    setPage(1);
    setExpandedIds(new Set());
    try {
      const res = await fetch(`/api/orders?businessDate=${date}`);
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate, fetchOrders]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const visible = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const today = currentBusinessDate();

  const sidebarContent = (
    <AdminSidebar
      logoUrl={logoUrl}
      username={username}
      lang={lang}
      setLang={setLang}
      activePage="history"
      role={role}
      onMobileClose={() => setMobileOpen(false)}
    />
  );

  return (
    <div className="flex bg-dark-900 min-h-screen">
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
          <p className="font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Club Vanilla</p>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">{t.orderHistory}</h1>
              <p className="text-white/30 text-sm mt-0.5">
                {loading ? t.loadingData : `${orders.length} ${t.ordersCount}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-white/40 text-xs font-semibold uppercase tracking-widest shrink-0">
                {t.historyDate}
              </label>
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-pink/50 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Orders table */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <span className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <svg className="w-10 h-10 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/30 text-sm">{t.noOrdersForDay}</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-5">{t.timeJST}</th>
                        <th className="text-left text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-4">{t.tableName}</th>
                        <th className="text-center text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-4 hidden sm:table-cell">{t.itemCount}</th>
                        <th className="text-right text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-4">{t.revenue}</th>
                        <th className="text-center text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-4">Status</th>
                        <th className="text-left text-white/30 text-[11px] font-semibold uppercase tracking-widest py-3 px-4 hidden md:table-cell">{t.actedBy}</th>
                        <th className="py-3 px-4 w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {visible.map((order) => {
                        const isExpanded = expandedIds.has(order.id);
                        const items: OrderItem[] = order.items ?? [];
                        const actedBy =
                          order.status === "done" ? order.completed_by
                          : order.status === "cancelled" ? order.canceled_by
                          : null;

                        return (
                          <Fragment key={order.id}>
                            <tr
                              onClick={() => toggleExpand(order.id)}
                              className="cursor-pointer hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-3.5 px-5 text-white/60 text-sm tabular-nums">{formatTimeJST(order.created_at)}</td>
                              <td className="py-3.5 px-4 text-white text-sm font-medium">{order.table?.name ?? "—"}</td>
                              <td className="py-3.5 px-4 text-white/50 text-sm text-center hidden sm:table-cell">{items.length}</td>
                              <td className="py-3.5 px-4 text-white/80 text-sm font-medium text-right tabular-nums">{formatCurrency(order.total)}</td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                  order.status === "done" ? "bg-emerald-400/10 text-emerald-400"
                                  : order.status === "cancelled" ? "bg-red-400/10 text-red-400"
                                  : "bg-brand-pink/10 text-brand-pink"
                                }`}>
                                  {order.status === "done" ? t.done
                                    : order.status === "cancelled" ? t.cancelled
                                    : t.pending}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-white/40 text-sm hidden md:table-cell">{actedBy ?? "—"}</td>
                              <td className="py-3.5 px-4">
                                <svg className={`w-4 h-4 text-white/30 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr>
                                <td colSpan={7} className="px-5 pb-4 pt-1">
                                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
                                    {/* Item list */}
                                    <div className="flex flex-col gap-1.5">
                                      {items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                                          <span className="text-white/70">
                                            {lang === "ja" ? (item.item_name_ja ?? item.item_name_en) : item.item_name_en}
                                            <span className="text-white/30 ml-1.5 text-xs">×{item.quantity}</span>
                                          </span>
                                          <span className="text-white/50 tabular-nums shrink-0">
                                            ¥{(item.price * item.quantity).toLocaleString()}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Note */}
                                    {order.note && (
                                      <p className="text-white/40 text-xs italic border-t border-white/5 pt-3">
                                        &ldquo;{order.note}&rdquo;
                                      </p>
                                    )}

                                    {/* Audit trail */}
                                    {(order.completed_by || order.canceled_by) && (
                                      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-white/5 pt-3 text-xs text-white/40">
                                        {order.completed_by && (
                                          <span>
                                            {t.completedBy}:{" "}
                                            <span className="text-emerald-400/70">{order.completed_by}</span>
                                          </span>
                                        )}
                                        {order.canceled_by && (
                                          <span>
                                            {t.cancelledBy}:{" "}
                                            <span className="text-red-400/70">{order.canceled_by}</span>
                                          </span>
                                        )}
                                        {order.authorized_by && order.authorized_by !== order.canceled_by && (
                                          <span>
                                            {t.authorizedBy}:{" "}
                                            <span className="text-white/60">{order.authorized_by}</span>
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="px-5 py-4 border-t border-white/8 flex items-center justify-between gap-4">
                    <button
                      onClick={() => { setPage((p) => p - 1); setExpandedIds(new Set()); }}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 text-sm font-semibold hover:bg-white/8 hover:text-white/80 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      {t.prevPage}
                    </button>
                    <span className="text-white/30 text-sm tabular-nums">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => { setPage((p) => p + 1); setExpandedIds(new Set()); }}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 text-sm font-semibold hover:bg-white/8 hover:text-white/80 transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      {t.nextPage}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
