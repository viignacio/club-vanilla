"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminDict } from "@/lib/i18n/adminDict";
import { useAdminLang } from "@/hooks/useAdminLang";
import LangSwitcher from "@/components/LangSwitcher";

export default function AdminLoginPage() {
  const router = useRouter();
  const { lang, setLang } = useAdminLang();
  const t = adminDict[lang];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(t.invalidCredentials);
      }
    } catch {
      setError(t.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-brand-purple/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-brand-pink/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-pink/4 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Lang toggle */}
        <div className="flex justify-end mb-6">
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border border-white/10 mb-5 shadow-lg shadow-brand-pink/10">
            <svg className="w-7 h-7 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent leading-tight">
            Club Vanilla
          </h1>
          <p className="text-white/30 text-sm mt-1.5">{t.adminDashboard}</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs font-medium pl-1">{t.username}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.enterUsername}
                required
                autoFocus
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-brand-pink/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs font-medium pl-1">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-brand-pink/50 focus:bg-white/8 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-400/8 border border-red-400/20">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-brand-pink/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.signingIn}
                </span>
              ) : t.signIn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
