"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminDict } from "@/lib/i18n/adminDict";
import { useAdminLang } from "@/hooks/useAdminLang";

export default function CredentialsManager({ logoUrl, username }: { logoUrl?: string; username?: string }) {
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [mobileOpen, setMobileOpen] = useState(false);

  // Username form
  const [newUsername, setNewUsername] = useState("");
  const [currentPasswordForUsername, setCurrentPasswordForUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  async function handleUpdateUsername(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() || !currentPasswordForUsername) return;
    setSavingUsername(true);
    setUsernameStatus(null);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPasswordForUsername, newUsername }),
      });
      if (res.ok) {
        setUsernameStatus({ ok: true, msg: t.usernameUpdated });
        setNewUsername("");
        setCurrentPasswordForUsername("");
      } else {
        const data = await res.json();
        const msg = data.error === "Incorrect current password" ? t.incorrectPassword : data.error;
        setUsernameStatus({ ok: false, msg });
      }
    } finally {
      setSavingUsername(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ ok: false, msg: t.passwordMismatch });
      return;
    }
    setSavingPassword(true);
    setPasswordStatus(null);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordStatus({ ok: true, msg: t.passwordUpdated });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        const msg = data.error === "Incorrect current password" ? t.incorrectPassword : data.error;
        setPasswordStatus({ ok: false, msg });
      }
    } finally {
      setSavingPassword(false);
    }
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
        <p className="text-white/30 text-xs mt-0.5">{username ? `Hello, ${username}!` : t.brandSubtitle}</p>
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
            <Link href="/admin/tables" onClick={() => setMobileOpen(false)} className={navItem(false)}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              {t.tableManagement}
            </Link>
            <button className={navItem(true)}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {t.userManagement}
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
            <p className="text-white/30 text-xs">{t.userManagement}</p>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 max-w-xl px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-8">
          {/* Page header */}
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">{t.accountSettings}</h1>
          </div>

          {/* Change Username */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-white font-semibold mb-4">{t.changeUsername}</h2>
            <form onSubmit={handleUpdateUsername} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium">{t.newUsername}</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  autoComplete="username"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium">{t.currentPassword}</label>
                <input
                  type="password"
                  value={currentPasswordForUsername}
                  onChange={(e) => setCurrentPasswordForUsername(e.target.value)}
                  autoComplete="current-password"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
                />
              </div>
              {usernameStatus && (
                <p className={`text-xs ${usernameStatus.ok ? "text-emerald-400" : "text-red-400"}`}>
                  {usernameStatus.msg}
                </p>
              )}
              <button
                type="submit"
                disabled={savingUsername || !newUsername.trim() || !currentPasswordForUsername}
                className="self-start px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-brand-pink/15"
              >
                {savingUsername ? t.saving : t.saveChanges}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-white font-semibold mb-4">{t.changePassword}</h2>
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium">{t.currentPassword}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium">{t.newPassword}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-xs font-medium">{t.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand-pink/50 transition-colors"
                />
              </div>
              {passwordStatus && (
                <p className={`text-xs ${passwordStatus.ok ? "text-emerald-400" : "text-red-400"}`}>
                  {passwordStatus.msg}
                </p>
              )}
              <button
                type="submit"
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="self-start px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-brand-pink/15"
              >
                {savingPassword ? t.saving : t.saveChanges}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
