import { notFound } from "next/navigation";
import { isValidLang, Lang } from "@/lib/i18n/config";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery, promotionQuery } from "@/sanity/lib/queries";
import { SiteSettings, Promotion } from "@/lib/types/page";
import { getLocalized } from "@/lib/types/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromotionProvider from "@/components/layout/PromotionProvider";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang: rawLang } = await params;

  if (!isValidLang(rawLang)) {
    notFound();
  }

  const lang = rawLang as Lang;

  const [settings, promotion] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery, {}, { next: { revalidate: 3600, tags: ["site-settings"] } }),
    client.fetch<Promotion>(promotionQuery, {}, { next: { revalidate: 3600, tags: ["promotion"] } }),
  ]);

  const siteName = getLocalized(settings?.siteName, lang) || "Club Vanilla";
  const logoUrl = settings?.logo?.asset?.url ?? null;

  return (
    <>
      <Navbar lang={lang} navItems={settings?.nav ?? []} siteName={siteName} logoUrl={logoUrl} />
      <PromotionProvider promotion={promotion ?? {}} lang={lang}>
        <main className="min-h-screen">
          {children}
        </main>
      </PromotionProvider>
      <Footer lang={lang} settings={settings ?? {}} />
    </>
  );
}
