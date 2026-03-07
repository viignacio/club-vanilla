import { defineType, defineField } from "sanity";

const menuItemFields = [
  defineField({
    name: "name",
    title: "Name",
    type: "localizedString",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "unavailable",
    title: "Unavailable",
    type: "boolean",
    description: "When enabled, this item is shown greyed out on the order page with an 'Unavailable' label instead of its price.",
    initialValue: false,
  }),
  defineField({
    name: "description",
    title: "Description (optional)",
    type: "localizedString",
  }),
  defineField({
    name: "price",
    title: "Standard Price (¥)",
    type: "number",
  }),
  defineField({
    name: "taxIncluded",
    title: "Tax Included?",
    type: "boolean",
    description: 'Appends "(Incl. Tax)" / "（税込）" after the price.',
    initialValue: false,
  }),
  defineField({
    name: "priceDisplay",
    title: "Price Display Override (optional)",
    type: "string",
    description: 'e.g. "¥1,100~" or "¥6,000 +"',
  }),
  defineField({
    name: "image",
    title: "Image (optional)",
    type: "image",
    options: { hotspot: true },
  }),
];

const menuItemPreview = {
  select: { title: "name.en", titleJa: "name.ja", subtitle: "price", unavailable: "unavailable" },
  prepare({ title, titleJa, subtitle, unavailable }: { title?: string; titleJa?: string; subtitle?: number; unavailable?: boolean }) {
    const priceLabel = subtitle ? `¥${subtitle.toLocaleString()}` : "";
    return {
      title: title || titleJa,
      subtitle: unavailable ? "⚠️ Unavailable" : priceLabel,
    };
  },
};

export const menu = defineType({
  name: "menu",
  title: "Menu Categories",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "localizedString",
      description: "Displayed as the category heading on the storefront.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hideFromOrderPage",
      title: "Hide from Order Page",
      type: "boolean",
      description: "When enabled, this entire category will not appear on the order page.",
      initialValue: false,
    }),
    defineField({
      name: "items",
      title: "Menu Items",
      type: "array",
      of: [{ type: "object", fields: menuItemFields, preview: menuItemPreview }],
    }),
  ],
  preview: {
    select: { title: "name.en" },
    prepare({ title }) {
      return { title: title || "Menu Category" };
    },
  },
});
