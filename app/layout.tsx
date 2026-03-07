import type { Metadata } from "next";
import { Noto_Sans_JP, Carrois_Gothic } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const carroisGothic = Carrois_Gothic({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "Club Vanilla - %s",
    default: "Club Vanilla",
  },
  description: "Philippine Show Pub in Oyama, Tochigi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${carroisGothic.variable} antialiased bg-dark-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
