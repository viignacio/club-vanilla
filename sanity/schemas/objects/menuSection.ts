import { defineType, defineField } from "sanity";

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu Section",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
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
    select: { title: "internalTitle" },
    prepare({ title }) {
      return { title: "Menu Section", subtitle: title };
    },
  },
});
