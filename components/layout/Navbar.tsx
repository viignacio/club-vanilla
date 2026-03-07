"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Lang } from "@/lib/i18n/config";
import { NavItem } from "@/lib/types/page";
import { getLocalized } from "@/lib/types/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  lang: Lang;
  navItems: NavItem[];
  siteName: string;
  logoUrl?: string | null;
}

export default function Navbar({ lang, navItems, siteName, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hasHero = !!document.querySelector("[data-hero-banner]");
    if (!hasHero) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (href: string) => {
    const fullHref = `/${lang}${href === "/" ? "" : href}`;
    if (href === "/" || href === "") {
      return pathname === `/${lang}` || pathname === `/${lang}/`;
    }
    return pathname.startsWith(fullHref);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-dark-900/95 backdrop-blur-md shadow-lg shadow-brand-purple/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 group">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={120}
                height={48}
                className="h-10 sm:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold tracking-widest bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                VANILLA
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const label = getLocalized(item.label, lang);
              const href = `/${lang}${item.href === "/" ? "" : item.href}`;
              const active = isActive(item.href ?? "");
              return (
                <Link
                  key={item._key}
                  href={href}
                  className={`nav-link text-sm font-semibold tracking-widest uppercase transition-colors ${
                    active ? "text-brand-pink active" : "text-white/70 hover:text-brand-pink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-dark-800/95 backdrop-blur-md border-t border-brand-purple/20 py-4 px-2">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const label = getLocalized(item.label, lang);
                const href = `/${lang}${item.href === "/" ? "" : item.href}`;
                const active = isActive(item.href ?? "");
                return (
                  <Link
                    key={item._key}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-semibold tracking-widest uppercase py-2 transition-colors ${
                      active ? "text-brand-pink" : "text-white/70"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-brand-purple/20">
                <LanguageSwitcher currentLang={lang} />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
