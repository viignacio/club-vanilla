"use client";

import { useState } from "react";
import { adminDict } from "@/lib/i18n/adminDict";
import type { Lang } from "@/lib/i18n/config";

interface User {
  id: string;
  username: string;
  role: string;
}

interface UserManagerProps {
  initialUsers: User[];
  lang: Lang;
  currentUsername?: string;
}

export default function UserManager({ initialUsers, lang, currentUsername }: UserManagerProps) {
  const t = adminDict[lang];
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Create form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("crew");
  const [creating, setCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword) return;
    setCreating(true);
    setCreateStatus(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword, role: newRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => [...prev, data.user]);
        setNewUsername("");
        setNewPassword("");
        setNewRole("crew");
        setCreateStatus({ ok: true, msg: t.userCreated });
      } else {
        setCreateStatus({ ok: false, msg: t.failedToCreateUser });
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-white font-semibold">{t.manageUsers}</h2>
        <p className="text-white/40 text-xs mt-0.5">{t.manageUsersDesc}</p>
      </div>

      {/* User list */}
      <div className="flex flex-col gap-2">
        {users.length === 0 ? (
          <p className="text-white/30 text-sm">{t.noUsers}</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user.username}</p>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                    user.role === "admin" ? "text-brand-pink/70" : "text-white/30"
                  }`}>
                    {user.role === "admin" ? t.adminRole : t.crewRole}
                  </span>
                </div>
              </div>
              {user.username !== currentUsername && (
                confirmDeleteId === user.id ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/40 hover:text-white transition-all"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-40"
                    >
                      {t.delete}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(user.id)}
                    disabled={!!deletingId}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>

      {/* Create user form */}
      <div className="border-t border-white/5 pt-5">
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-xs font-medium">{t.username}</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoComplete="off"
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
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/40 text-xs font-medium">{t.roleLabel}</label>
            <div className="relative">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="crew" className="bg-dark-800 text-white">{t.crewRole}</option>
                <option value="admin" className="bg-dark-800 text-white">{t.adminRole}</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {createStatus && (
            <p className={`text-xs ${createStatus.ok ? "text-emerald-400" : "text-red-400"}`}>
              {createStatus.msg}
            </p>
          )}
          <button
            type="submit"
            disabled={creating || !newUsername.trim() || !newPassword}
            className="self-start px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-brand-pink/15"
          >
            {creating ? t.creating : t.createUser}
          </button>
        </form>
      </div>
    </div>
  );
}
