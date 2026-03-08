"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { adminDict } from "@/lib/i18n/adminDict";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface QRTable {
  id: string;
  name: string;
  secret_key: string;
}

export function getQrUrl(table: QRTable): string {
  return `${SITE_URL}/order?table=${table.id}&key=${table.secret_key}`;
}

export function QRModal({ table, onClose, t }: { table: QRTable; onClose: () => void; t: typeof adminDict["en"] }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const url = getQrUrl(table);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: { dark: "#0D0B1E", light: "#FFFFFF" },
    }).then(setQrDataUrl);
  }, [url]);

  function handleDownload() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${table.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-3xl border border-white/10 w-full max-w-sm p-6 flex flex-col items-center gap-5 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-white font-bold">{table.name}</p>
            <p className="text-white/30 text-xs mt-0.5">{t.scanToOrder}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {qrDataUrl ? (
          <div className="rounded-2xl overflow-hidden ring-4 ring-white/10 p-3 bg-white">
            <Image src={qrDataUrl} alt={`QR code for ${table.name}`} width={280} height={280} />
          </div>
        ) : (
          <div className="w-[280px] h-[280px] rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <p className="text-white/20 text-xs text-center break-all font-mono leading-relaxed">{url}</p>

        <div className="flex gap-3 w-full">
          <button onClick={handleDownload} disabled={!qrDataUrl}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-brand-pink/20">
            {t.downloadPng}
          </button>
          <button onClick={() => navigator.clipboard.writeText(url)}
            className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all">
            {t.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
