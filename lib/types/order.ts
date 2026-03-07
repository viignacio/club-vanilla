export interface OrderMenuItem {
  _key: string;
  name: { en: string; ja?: string };
  description?: { en?: string; ja?: string };
  price: number;
  taxIncluded?: boolean;
  unavailable?: boolean;
  imageUrl?: string;
}

export interface OrderMenuCategory {
  _key: string;
  name: { en: string; ja?: string };
  items: OrderMenuItem[];
}
