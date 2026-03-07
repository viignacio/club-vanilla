import { PageBlock } from "@/lib/types/blocks";
import { Lang } from "@/lib/i18n/config";
import ImageWithContent from "./ImageWithContent";
import ImagePairWithContent from "./ImagePairWithContent";
import HeroBanner from "./HeroBanner";
import CompactHeroBanner from "./CompactHeroBanner";
import BasicContent from "./BasicContent";
import FaqSection from "./FaqSection";
import MenuSection from "./MenuSection";
import ContactForm from "./ContactForm";
import NeonCampaign from "./NeonCampaign";
import CardGrid from "./CardGrid";

interface BlockRendererProps {
  blocks: PageBlock[];
  lang: Lang;
}

export default function BlockRenderer({ blocks, lang }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "imageWithContent":
            return <ImageWithContent key={block._key} block={block} lang={lang} />;
          case "imagePairWithContent":
            return <ImagePairWithContent key={block._key} block={block} lang={lang} />;
          case "heroBanner":
            return <HeroBanner key={block._key} block={block} lang={lang} />;
          case "compactHeroBanner":
            return <CompactHeroBanner key={block._key} block={block} lang={lang} />;
          case "basicContent":
            return <BasicContent key={block._key} block={block} lang={lang} />;
          case "faqSection":
            return <FaqSection key={block._key} block={block} lang={lang} />;
          case "menuSection":
            return <MenuSection key={block._key} block={block} lang={lang} />;
          case "contactFormBlock":
            return <ContactForm key={block._key} block={block} lang={lang} />;
          case "neonCampaign":
            return <NeonCampaign key={block._key} block={block} lang={lang} />;
          case "cardGrid":
            return <CardGrid key={block._key} block={block} lang={lang} />;
          default:
            return null;
        }
      })}
    </>
  );
}
