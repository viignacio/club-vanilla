import { groq } from "next-sanity";

export const localizedStringFields = `
  en,
  ja
`;

export const localizedTextFields = `
  en,
  ja
`;

export const heroBannerFields = `
  backgroundType,
  backgroundImage { ..., asset->{ _id, url, metadata { lqip } } },
  backgroundVideo {
    videoFile { asset-> },
    posterImage { ..., asset->{ _id, url, metadata { lqip } } }
  },
  heading { ${localizedStringFields} },
  subheading { ${localizedStringFields} },
  contentAlignment,
  ctaButton {
    label { ${localizedStringFields} },
    href
  },
  textAnimation,
  overlayOpacity
`;

export const imageWithContentFields = `
  backgroundImage { ..., asset->{ _id, url, metadata { lqip } } },
  overlayStrength,
  contentAlignment,
  marquee {
    text { ${localizedStringFields} },
    direction
  },
  headline { ${localizedStringFields} },
  logo { ..., asset->{ _id, url, metadata { lqip } } },
  subheading { ${localizedStringFields} },
  helperText { ${localizedStringFields} },
  ctaButton {
    label { ${localizedStringFields} },
    href
  }
`;

export const basicContentFields = `
  image { ..., asset->{ _id, url, metadata { lqip } } },
  imagePosition,
  contentAlignment,
  heading { ${localizedStringFields} },
  body {
    en[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } },
    ja[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } }
  },
  ctaButton {
    label { ${localizedStringFields} },
    href
  },
  backgroundColor,
  googleMapsUrl
`;

export const faqSectionFields = `
  headingAlignment,
  sectionHeading { ${localizedStringFields} },
  sectionSubheading { ${localizedStringFields} },
  items[] {
    _key,
    question { ${localizedStringFields} },
    answer { ${localizedTextFields} }
  }
`;

const menuItemFields = `
  _key,
  name { ${localizedStringFields} },
  description { ${localizedStringFields} },
  price,
  taxIncluded,
  priceDisplay,
  image { ..., asset-> }
`;

export const menuSectionFields = `
  sectionHeading { ${localizedStringFields} },
  sectionSubheading { ${localizedStringFields} },
  displayStyle,
  categories[] {
    _key,
    name { ${localizedStringFields} },
    items[] { ${menuItemFields} }
  },
  items[] { ${menuItemFields} }
`;

export const contactFormBlockFields = `
  sectionHeading { ${localizedStringFields} },
  sectionSubheading { ${localizedStringFields} }
`;

export const imagePairWithContentFields = `
  contentAlignment,
  items[] {
    _key,
    image { ..., asset->{ _id, url, metadata { lqip } } },
    overlayStrength,
    heading { ${localizedStringFields} },
    subheading { ${localizedStringFields} },
    price,
    taxIncluded,
    helperText {
      en[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } },
      ja[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } }
    }
  },
  subtitle {
    en[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } },
    ja[] { ..., markDefs[]{ ..., _type == "link" => { href, blank } } }
  }
`;

export const neonCampaignFields = `
  sectionTitle { ${localizedStringFields} },
  sectionSubtitle { ${localizedStringFields} },
  campaignLabel { ${localizedStringFields} },
  content {
    en[] { ..., markDefs[]{ ..., _type == "highlight" => { color } } },
    ja[] { ..., markDefs[]{ ..., _type == "highlight" => { color } } }
  }
`;

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    title { ${localizedStringFields} },
    seoTitle { ${localizedStringFields} },
    seoDescription { ${localizedStringFields} },
    showPromotion,
    blocks[] {
      _type,
      _key,
      _type == "imageWithContent" => { ${imageWithContentFields} },
      _type == "heroBanner" => { ${heroBannerFields} },
      _type == "compactHeroBanner" => { ${heroBannerFields} },
      _type == "imagePairWithContent" => { ${imagePairWithContentFields} },
      _type == "basicContent" => { ${basicContentFields} },
      _type == "faqSection" => { ${faqSectionFields} },
      _type == "menuSection" => { ${menuSectionFields} },
      _type == "contactFormBlock" => { ${contactFormBlockFields} },
      _type == "neonCampaign" => { ${neonCampaignFields} }
    }
  }
`;

// Fetches all menuSection blocks site-wide, flattened across pages.
// Only includes items with a numeric price (orderable items).
export const orderMenuQuery = groq`
  *[_type == "page"][].blocks[_type == "menuSection"] {
    _key,
    sectionHeading { en, ja },
    "categories": categories[] {
      _key,
      name { en, ja },
      "items": items[defined(price) && price > 0] {
        _key,
        name { en, ja },
        description { en, ja },
        price,
        taxIncluded,
        "imageUrl": image.asset->url
      }
    },
    "items": items[defined(price) && price > 0] {
      _key,
      name { en, ja },
      description { en, ja },
      price,
      taxIncluded,
      "imageUrl": image.asset->url
    }
  }
`;

export const dictionaryQuery = groq`
  *[_type == "dictionary"][0] {
    entries[] { key, en, ja }
  }
`;

export const adminLogoQuery = groq`
  *[_type == "siteSettings"][0].logo.asset->url
`;

export const promotionQuery = groq`
  *[_type == "promotion"][0] {
    enabled,
    text { ${localizedStringFields} },
    direction
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName { ${localizedStringFields} },
    seoDescription { ${localizedStringFields} },
    logo { asset->{ url } },
    ogImage { ..., asset-> },
    nav[] {
      _key,
      label { ${localizedStringFields} },
      href
    },
    footer {
      copyrightText { ${localizedStringFields} },
      phone,
      address { ${localizedStringFields} },
      hours { ${localizedStringFields} },
      socialLinks[] {
        _key,
        platform,
        url
      }
    }
  }
`;
