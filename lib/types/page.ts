import { LocalizedString } from "./i18n";
import { PageBlock } from "./blocks";

export interface Page {
  title?: LocalizedString;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
  showPromotion?: boolean;
  blocks?: PageBlock[];
}

export interface NavItem {
  _key: string;
  label?: LocalizedString;
  href?: string;
}

export interface SocialLink {
  _key: string;
  platform?: "instagram" | "twitter" | "facebook" | "line";
  url?: string;
}

export interface Promotion {
  enabled?: boolean;
  text?: LocalizedString;
  direction?: "left" | "right";
}

export interface SiteSettings {
  siteName?: LocalizedString;
  seoDescription?: LocalizedString;
  logo?: { asset?: { url?: string } };
  ogImage?: { asset?: { url?: string } };
  nav?: NavItem[];
  footer?: {
    copyrightText?: LocalizedString;
    phone?: string;
    address?: LocalizedString;
    hours?: LocalizedString;
    socialLinks?: SocialLink[];
  };
}
