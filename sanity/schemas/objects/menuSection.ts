import { defineType, defineField } from "sanity";

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
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "menu" }] }],
      validation: (Rule) => Rule.required().min(1),
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
