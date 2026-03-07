import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { getPage } from "@/lib/getPage";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import SetPagePromotion from "@/components/layout/SetPagePromotion";
import { PageBlock } from "@/lib/types/blocks";

interface MenuPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) return {};
  const lang = rawLang as Lang;
  const page = await getPage("menu");
  return {
    title: getLocalized(page?.seoTitle, lang) || `Menu | Club Vanilla`,
    description: getLocalized(page?.seoDescription, lang) || "Food and drinks menu at Club Vanilla",
  };
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) notFound();
  const lang = rawLang as Lang;

  const page = await getPage("menu");
  if (!page) notFound();

  return (
    <>
      <SetPagePromotion show={!!page.showPromotion} />
      <BlockRenderer blocks={(page.blocks ?? []) as PageBlock[]} lang={lang} />
    </>
  );
}
