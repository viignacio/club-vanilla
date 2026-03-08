"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Table } from "@/lib/supabase/types";
import { adminDict } from "@/lib/i18n/adminDict";
import { useAdminLang } from "@/hooks/useAdminLang";
import { QRModal } from "@/components/admin/QRModal";

export default function TableManager({ initialTables, logoUrl }: { initialTables: Table[]; logoUrl?: string }) {
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [tables, setTables] = useState<Table[]>(initialTables);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrTable, setQrTable] = useState<Table | null>(null);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleAdd() {
    if (!newName.trim()) return;
    setIsAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const { table } = await res.json();
        setTables((prev) => [...prev, table]);
        setNewName("");
      } else setError(t.failedToCreate);
    } finally { setIsAdding(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tables/${id}`, { method: "DELETE" });
      if (res.ok) setTables((prev) => prev.filter((t) => t.id !== id));
    } finally { setDeletingId(null); }
  }

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

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
            <Link href="/admin" onClick={() => setMobileOpen(false)} className={navItem(false)}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {t.allTables}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">{t.management}</p>
          <div className="flex flex-col gap-0.5">
            <button className={navItem(true)}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              {t.tableManagement}
            </button>
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
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-purple/4 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-pink/4 rounded-full blur-3xl" />
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
            <p className="text-white/30 text-xs">{t.tableManagement}</p>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 max-w-3xl px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-8">
          {/* Page header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">{t.tableManagement}</h1>
              <p className="text-white/30 text-sm mt-0.5">{t.tableCount(tables.length)}</p>
            </div>
          </div>

          {/* Add table */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-white font-semibold mb-1">{t.addTable}</h2>
            <p className="text-white/30 text-xs mb-4">{t.addTableDesc}</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder={t.tablePlaceholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
              />
              <button onClick={handleAdd} disabled={isAdding || !newName.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-brand-pink/15 shrink-0">
                {isAdding ? t.adding : t.add}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          {/* Table list */}
          <div className="flex flex-col gap-3">
            {tables.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/8 py-16 text-center">
                <p className="text-white/20 text-sm font-medium">{t.noTablesYet}</p>
                <p className="text-white/10 text-xs mt-1">{t.addFirstTable}</p>
              </div>
            ) : (
              tables.map((table) => (
                <div key={table.id}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/6 hover:border-white/10 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-pink/15 to-brand-purple/15 border border-white/8 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-pink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{table.name}</p>
                    <p className="text-white/25 text-xs mt-0.5 font-mono truncate">{table.id.slice(0, 12)}…</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setQrTable(table)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 text-xs font-semibold hover:bg-brand-pink/15 hover:text-brand-pink hover:border-brand-pink/30 transition-all">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                      </svg>
                      {t.qrCode}
                    </button>
                    <button onClick={() => handleDelete(table.id)} disabled={deletingId === table.id}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {qrTable && <QRModal table={qrTable} onClose={() => setQrTable(null)} t={t} />}
    </div>
  );
}
