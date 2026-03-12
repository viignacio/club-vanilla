"use client";

import { useState } from "react";
import { adminDict } from "@/lib/i18n/adminDict";
import { useAdminLang } from "@/hooks/useAdminLang";
import AdminSidebar from "@/components/admin/AdminSidebar";

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

  const sidebarContent = (
    <AdminSidebar
      logoUrl={logoUrl}
      username={username}
      lang={lang}
      setLang={setLang}
      activePage="settings"
      onMobileClose={() => setMobileOpen(false)}
    />
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
