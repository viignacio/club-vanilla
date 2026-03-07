export const metadata = {
  title: "Invalid QR",
  robots: "noindex, nofollow",
};

export default function OrderInvalidPage() {
  return (
    <main className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-brand-pink/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white mb-2">Invalid QR Code</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Please scan the QR code on your table to place an order.
          </p>
          <p className="text-white/30 text-xs mt-3">
            QRコードをスキャンしてご注文ください。
          </p>
        </div>
      </div>
    </main>
  );
}
