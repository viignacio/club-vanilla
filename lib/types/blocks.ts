import { LocalizedString } from "./i18n";

export interface SanityImage {
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
    };
  };
  hotspot?: {
    x: number;
    y: number;
  };
}

export interface SanityFile {
  asset?: {
    _ref?: string;
    url?: string;
  };
}

// Hero Banner Block
export interface HeroBannerBlock {
  _type: "heroBanner";
  _key: string;
  backgroundType: "image" | "video";
  backgroundImage?: SanityImage;
  backgroundVideo?: {
    videoFile?: SanityFile;
    posterImage?: SanityImage;
  };
  heading?: LocalizedString;
  subheading?: LocalizedString;
  contentAlignment?: "left" | "center" | "right";
  ctaButton?: {
    label?: LocalizedString;
    href?: string;
  };
  textAnimation?: "none" | "fadeIn" | "slideUp" | "typewriter";
  overlayOpacity?: number;
}

// Basic Content Block
export interface BasicContentBlock {
  _type: "basicContent";
  _key: string;
  image?: SanityImage;
  imagePosition?: "left" | "right" | "center";
  heading?: LocalizedString;
  body?: LocalizedRichText;
  contentAlignment?: "left" | "center" | "right";
  ctaButton?: {
    label?: LocalizedString;
    href?: string;
  };
  backgroundColor?: "dark" | "pink" | "purple";
  googleMapsUrl?: string;
}

// FAQ Section Block
export interface FaqItem {
  _key: string;
  question?: LocalizedString;
  answer?: LocalizedString;
}

export interface FaqSectionBlock {
  _type: "faqSection";
  _key: string;
  headingAlignment?: "left" | "center" | "right";
  sectionHeading?: LocalizedString;
  sectionSubheading?: LocalizedString;
  items?: FaqItem[];
}

// Menu Section Block
export interface MenuItem {
  _key: string;
  name?: LocalizedString;
  description?: LocalizedString;
  price?: number;
  taxIncluded?: boolean;
  priceDisplay?: string;
  image?: SanityImage;
}

export interface MenuCategory {
  _key: string;
  name?: LocalizedString;
  items?: MenuItem[];
}

export interface MenuSectionBlock {
  _type: "menuSection";
  _key: string;
  sectionHeading?: LocalizedString;
  sectionSubheading?: LocalizedString;
  categories?: MenuCategory[];
  items?: MenuItem[];
  displayStyle?: "grid" | "list";
}

// Contact Form Block
export interface ContactFormBlock {
  _type: "contactFormBlock";
  _key: string;
  sectionHeading?: LocalizedString;
  sectionSubheading?: LocalizedString;
}

// Rich Text Block
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any[];

export interface LocalizedRichText {
  en?: PortableTextBlock;
  ja?: PortableTextBlock;
}

// Compact Hero Banner Block
export interface CompactHeroBannerBlock {
  _type: "compactHeroBanner";
  _key: string;
  backgroundType: "image" | "video";
  backgroundImage?: SanityImage;
  backgroundVideo?: {
    videoFile?: SanityFile;
    posterImage?: SanityImage;
  };
  heading?: LocalizedString;
  subheading?: LocalizedString;
  contentAlignment?: "left" | "center" | "right";
  ctaButton?: {
    label?: LocalizedString;
    href?: string;
  };
  textAnimation?: "none" | "fadeIn" | "slideUp" | "typewriter";
  overlayOpacity?: number;
}

// Image with Content Block
export interface ImageWithContentBlock {
  _type: "imageWithContent";
  _key: string;
  backgroundImage?: SanityImage;
  overlayStrength?: "none" | "light" | "dark" | "darker";
  contentAlignment?: "left" | "center" | "right";
  marquee?: {
    text?: LocalizedString;
    direction?: "left" | "right";
  };
  headline?: LocalizedString;
  logo?: SanityImage;
  subheading?: LocalizedString;
  helperText?: LocalizedString;
  ctaButton?: {
    label?: LocalizedString;
    href?: string;
  };
}

// Image Pair with Content Block
export interface ImagePairCard {
  _key: string;
  image?: SanityImage;
  overlayStrength?: "none" | "light" | "dark" | "darker";
  heading?: LocalizedString;
  subheading?: LocalizedString;
  price?: number;
  taxIncluded?: boolean;
  helperText?: LocalizedRichText;
}

export interface ImagePairWithContentBlock {
  _type: "imagePairWithContent";
  _key: string;
  contentAlignment?: "left" | "center" | "right";
  items?: ImagePairCard[];
  subtitle?: LocalizedRichText;
}

// Neon Campaign Block
export interface NeonCampaignBlock {
  _type: "neonCampaign";
  _key: string;
  sectionTitle?: LocalizedString;
  sectionSubtitle?: LocalizedString;
  campaignLabel?: LocalizedString;
  content?: LocalizedRichText;
}

// Union type for all blocks
export type PageBlock =
  | ImageWithContentBlock
  | ImagePairWithContentBlock
  | BasicContentBlock
  | HeroBannerBlock
  | CompactHeroBannerBlock
  | FaqSectionBlock
  | MenuSectionBlock
  | ContactFormBlock
  | NeonCampaignBlock;
