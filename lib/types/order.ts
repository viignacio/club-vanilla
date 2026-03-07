export interface OrderMenuItem {
  _key: string;
  name: { en: string; ja?: string };
  description?: { en?: string; ja?: string };
  price: number;
  taxIncluded?: boolean;
  imageUrl?: string;
}

export interface OrderMenuCategory {
  _key: string;
  name: { en: string; ja?: string };
  items: OrderMenuItem[];
}

export interface OrderMenuSection {
  _key: string;
  sectionHeading?: { en?: string; ja?: string };
  categories?: OrderMenuCategory[];
  items?: OrderMenuItem[];
}
