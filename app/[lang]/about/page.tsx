import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, Lang } from "@/lib/i18n/config";
import { getLocalized } from "@/lib/types/i18n";
import { getPage } from "@/lib/getPage";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import SetPagePromotion from "@/components/layout/SetPagePromotion";
import { PageBlock } from "@/lib/types/blocks";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) return {};
  const lang = rawLang as Lang;
  const page = await getPage("about");
  return {
    title: getLocalized(page?.seoTitle, lang) || (lang === "ja" ? "について" : "About"),
    description: getLocalized(page?.seoDescription, lang) || "About Club Vanilla",
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang: rawLang } = await params;
  if (!isValidLang(rawLang)) notFound();
  const lang = rawLang as Lang;

  const page = await getPage("about");
  if (!page) notFound();

  return (
    <>
      <SetPagePromotion show={!!page.showPromotion} />
      <BlockRenderer blocks={(page.blocks ?? []) as PageBlock[]} lang={lang} />
    </>
  );
}
