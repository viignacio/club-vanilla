import { localizedString, localizedText } from "./objects/localizedString";
import { localizedRichText } from "./objects/localizedRichText";
import { heroBanner } from "./objects/heroBanner";
import { compactHeroBanner } from "./objects/compactHeroBanner";
import { basicContent } from "./objects/basicContent";
import { imageWithContent } from "./objects/imageWithContent";
import { imagePairWithContent } from "./objects/imagePairWithContent";
import { faqSection } from "./objects/faqSection";
import { menuSection } from "./objects/menuSection";
import { contactFormBlock } from "./objects/contactFormBlock";
import { neonCampaign } from "./objects/neonCampaign";
import { dictionary } from "./documents/dictionary";
import { siteSettings } from "./documents/siteSettings";
import { promotion } from "./documents/promotion";
import { page } from "./documents/page";

export const schemaTypes = [
  // Objects (defined first — referenced by documents)
  localizedString,
  localizedText,
  localizedRichText,
  heroBanner,
  compactHeroBanner,
  basicContent,
  imageWithContent,
  imagePairWithContent,
  faqSection,
  menuSection,
  contactFormBlock,
  neonCampaign,
  // Documents
  dictionary,
  siteSettings,
  promotion,
  page,
];
