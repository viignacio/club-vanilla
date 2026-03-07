import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { getPage } from "@/lib/getPage";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import SetPagePromotion from "@/components/layout/SetPagePromotion";
import { PageBlock } from "@/lib/types/blocks";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) return {};
  const lang = rawLang as Lang;
  const page = await getPage("home");
  return {
    title: getLocalized(page?.seoTitle, lang) || (lang === "ja" ? "ホーム" : "Home"),
    description: getLocalized(page?.seoDescription, lang) || "Philippine Show Pub in Oyama, Tochigi",
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) notFound();
  const lang = rawLang as Lang;

  const page = await getPage("home");
  if (!page) notFound();

  return (
    <>
      <SetPagePromotion show={!!page.showPromotion} />
      <BlockRenderer blocks={(page.blocks ?? []) as PageBlock[]} lang={lang} />
    </>
  );
}
