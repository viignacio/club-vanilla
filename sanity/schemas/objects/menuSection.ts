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
  select: { title: "name.en", subtitle: "price" },
  prepare({ title, subtitle }: { title?: string; subtitle?: number }) {
    return { title, subtitle: subtitle ? `¥${subtitle.toLocaleString()}` : "" };
  },
};

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu Section",
  type: "object",
  fields: [
    defineField({
      name: "sectionHeading",
      title: "Section Heading",
      type: "localizedString",
    }),
    defineField({
      name: "sectionSubheading",
      title: "Section Subheading (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "categories",
      title: "Categories (optional)",
      description: "Group items under named headings, e.g. Wine, Beer. Leave empty to use flat Items list.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Category Name",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "object", fields: menuItemFields, preview: menuItemPreview }],
            }),
          ],
          preview: {
            select: { title: "name.en" },
            prepare({ title }: { title?: string }) {
              return { title: title || "Category" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "items",
      title: "Menu Items",
      description: "Used when no categories are defined.",
      type: "array",
      of: [{ type: "object", fields: menuItemFields, preview: menuItemPreview }],
    }),
    defineField({
      name: "displayStyle",
      title: "Display Style",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "List", value: "list" },
        ],
        layout: "radio",
      },
      initialValue: "list",
    }),
  ],
  preview: {
    select: { title: "sectionHeading.en" },
    prepare({ title }) {
      return { title: title || "Menu Section" };
    },
  },
});
