import { defineType, defineField } from "sanity";

const menuItemFields = [
  defineField({
    name: "name",
    title: "Name",
    type: "localizedString",
    validation: (Rule) => Rule.required(),
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
  select: { title: "name.en", titleJa: "name.ja", subtitle: "price" },
  prepare({ title, titleJa, subtitle }: { title?: string; titleJa?: string; subtitle?: number }) {
    return { title: title || titleJa, subtitle: subtitle ? `¥${subtitle.toLocaleString()}` : "" };
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
