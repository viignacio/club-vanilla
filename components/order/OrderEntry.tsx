"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface OrderEntryProps {
  tableId: string;
  secretKey: string;
}

// Gets or creates a stable device session ID in localStorage.
function getOrCreateSessionId(): string {
  const key = "cv_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// This component is shown when the user arrives via QR code (has ?table= and ?key= params).
// It validates the QR params with the server, sets the session cookie, then reloads.
export default function OrderEntry({ tableId, secretKey }: OrderEntryProps) {
  const router = useRouter();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const sessionId = getOrCreateSessionId();

    fetch("/api/order-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId, key: secretKey, sessionId }),
    })
      .then((res) => {
        if (res.ok) {
          // Cookie is now set — navigate to /order (clean URL, server re-renders with session)
          router.replace("/order");
        } else {
          router.replace("/order/invalid");
        }
      })
      .catch(() => {
        router.replace("/order/invalid");
      });
  }, [tableId, secretKey, router]);

  return (
    <main className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
        <p className="text-white/50 text-sm">Verifying table...</p>
      </div>
    </main>
  );
}
