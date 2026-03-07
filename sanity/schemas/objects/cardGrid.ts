import { defineType, defineField } from "sanity";

export const cardGrid = defineType({
  name: "cardGrid",
  title: "Card Grid",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
    defineField({
      name: "sectionHeadline",
      title: "Section Headline (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "sectionSubheadline",
      title: "Section Subheadline (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "2 Columns (4:5 card aspect)", value: 2 },
          { title: "3 Columns (16:9 card aspect)", value: 3 },
        ],
        layout: "radio",
      },
      initialValue: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "iconImage",
              title: "Icon Image (optional)",
              type: "image",
              description: "Upload an icon image. Takes priority over emoji if both are set.",
            }),
            defineField({
              name: "iconEmoji",
              title: "Icon Emoji / Text (optional)",
              type: "string",
              description: "Enter an emoji (e.g. 🎤) or any short text to display as the card icon.",
            }),
            defineField({
              name: "headline",
              title: "Headline (optional)",
              type: "localizedString",
            }),
            defineField({
              name: "subheadline",
              title: "Subheadline (optional)",
              type: "localizedString",
            }),
            defineField({
              name: "body",
              title: "Body Text (optional)",
              type: "localizedText",
            }),
          ],
          preview: {
            select: {
              title: "headline.en",
              titleJa: "headline.ja",
              subtitle: "iconEmoji",
            },
            prepare({ title, titleJa, subtitle }) {
              return { title: title || titleJa || "Card", subtitle };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "internalTitle" },
    prepare({ title }) {
      return { title: "Card Grid", subtitle: title };
    },
  },
});
