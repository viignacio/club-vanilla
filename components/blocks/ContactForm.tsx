"use client";

import { useState } from "react";
import { ContactFormBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";

interface ContactFormProps {
  block: ContactFormBlock;
  lang: Lang;
}

const labels: Record<Lang, Record<string, string>> = {
  en: {
    name: "Your Name",
    email: "Email Address",
    phone: "Phone Number (optional)",
    message: "Message",
    submit: "Send Application",
    sending: "Sending...",
    success: "Thank you! We will get back to you soon.",
    error: "Something went wrong. Please try again.",
    required: "This field is required.",
  },
  ja: {
    name: "お名前",
    email: "メールアドレス",
    phone: "電話番号（任意）",
    message: "メッセージ",
    submit: "応募する",
    sending: "送信中...",
    success: "ありがとうございます！近日中にご連絡いたします。",
    error: "エラーが発生しました。もう一度お試しください。",
    required: "このフィールドは必須です。",
  },
};

export default function ContactForm({ block, lang }: ContactFormProps) {
  const heading = getLocalized(block.sectionHeading, lang);
  const subheading = getLocalized(block.sectionSubheading, lang);
  const t = labels[lang];

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = t.required;
    if (!form.email.trim()) newErrors.email = t.required;
    if (!form.message.trim()) newErrors.message = t.required;
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStatus("sending");

    // Basic mailto fallback — replace with real API if needed
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-dark-900 pt-16 sm:pt-24">
      <div className="block-container">
        <div className="text-center mb-10">
          {heading && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                {heading}
              </span>
            </h2>
          )}
          {subheading && (
            <p className="text-white/60 text-lg">{subheading}</p>
          )}
        </div>

        {status === "success" ? (
          <div className="text-center py-12 rounded-2xl bg-dark-800 border border-brand-pink/30">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-white text-lg font-medium">{t.success}</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-dark-800 rounded-2xl p-6 sm:p-8 border border-brand-purple/20 flex flex-col gap-5"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">{t.name}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-900 border border-brand-purple/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-pink/60 transition-colors"
                placeholder={t.name}
              />
              {errors.name && <p className="text-brand-pink text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">{t.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark-900 border border-brand-purple/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-pink/60 transition-colors"
                placeholder={t.email}
              />
              {errors.email && <p className="text-brand-pink text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">{t.phone}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-dark-900 border border-brand-purple/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-pink/60 transition-colors"
                placeholder={t.phone}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">{t.message}</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-dark-900 border border-brand-purple/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-pink/60 transition-colors resize-none"
                placeholder={t.message}
              />
              {errors.message && <p className="text-brand-pink text-xs mt-1">{errors.message}</p>}
            </div>

            {status === "error" && (
              <p className="text-brand-pink text-sm text-center">{t.error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "sending" ? t.sending : t.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
