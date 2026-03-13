"use client";

import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/lib/i18n/config";
import { adminDict } from "@/lib/i18n/adminDict";
import LangSwitcher from "@/components/LangSwitcher";

interface AdminSidebarProps {
  logoUrl?: string;
  username?: string;
  lang: Lang;
  setLang: (l: Lang) => void;
  activePage: "orders" | "tables" | "settings";
  role?: "admin" | "crew";
  // Orders page — table list
  tables?: { id: string; name: string }[];
  activeTableId?: string;
  onTableSelect?: (id: string) => void;
  onMobileClose?: () => void;
}

export default function AdminSidebar({
  logoUrl,
  username,
  lang,
  setLang,
  activePage,
  role = "admin",
  tables,
  activeTableId,
  onTableSelect,
  onMobileClose,
}: AdminSidebarProps) {
  const t = adminDict[lang];

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

  const isOrdersPage = activePage === "orders";

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5 shrink-0">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Club Vanilla"
            width={120}
            height={40}
            className="object-contain object-left max-h-10 w-auto mb-1"
          />
        ) : (
          <p className="font-bold text-lg bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent leading-tight">
            Club Vanilla
          </p>
        )}
        <p className="text-white/30 text-xs mt-0.5">
          {username ? `Hello, ${username}!` : t.brandSubtitle}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto flex flex-col gap-6">
        <div>
          <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
            {t.orders}
          </p>
          <div className="flex flex-col gap-0.5">
            {/* All Tables row */}
            {isOrdersPage ? (
              <button
                onClick={() => { onTableSelect?.("all"); onMobileClose?.(); }}
                className={navItem(activeTableId === "all")}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {t.allTables}
              </button>
            ) : (
              <Link
                href="/admin"
                onClick={onMobileClose}
                className={navItem(false)}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {t.allTables}
              </Link>
            )}

            {isOrdersPage && tables?.map((table) => (
              <button
                key={table.id}
                onClick={() => { onTableSelect?.(table.id); onMobileClose?.(); }}
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

        {role === "admin" && (
          <div>
            <p className="text-white/20 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">
              {t.management}
            </p>
            <div className="flex flex-col gap-0.5">
              {activePage === "tables" ? (
                <button className={navItem(true)}>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  {t.tableManagement}
                </button>
              ) : (
                <Link
                  href="/admin/tables"
                  onClick={onMobileClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  {t.tableManagement}
                </Link>
              )}
              {activePage === "settings" ? (
                <button className={navItem(true)}>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {t.userManagement}
                </button>
              ) : (
                <Link
                  href="/admin/settings"
                  onClick={onMobileClose}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {t.userManagement}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Lang toggle + Logout */}
      <div className="px-3 py-4 border-t border-white/5 shrink-0 flex flex-col gap-1">
        <div className="px-3 mb-1">
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          {t.logout}
        </button>
      </div>
    </div>
  );
}
