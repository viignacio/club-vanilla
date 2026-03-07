import type { OrderSession } from "./types";

const SECRET = process.env.ORDER_SESSION_SECRET ?? "dev-secret-change-me";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export const ORDER_SESSION_COOKIE = "cv_order_session";

// Simple HMAC-based signing using Web Crypto (available in Next.js Edge / Node)
async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64url(buf: ArrayBuffer) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function signSession(payload: Omit<OrderSession, "expiresAt">): Promise<string> {
  const session: OrderSession = {
    ...payload,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  const data = JSON.stringify(session);
  const encoded = Buffer.from(data).toString("base64url");
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded));
  return `${encoded}.${base64url(sig)}`;
}

export async function verifySession(token: string): Promise<OrderSession | null> {
  try {
    const [encoded, sigB64] = token.split(".");
    if (!encoded || !sigB64) return null;

    const key = await getKey();
    const sigBuf = Buffer.from(sigB64.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      new TextEncoder().encode(encoded)
    );
    if (!valid) return null;

    const session: OrderSession = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (Date.now() > session.expiresAt) return null;

    return session;
  } catch {
    return null;
  }
}
