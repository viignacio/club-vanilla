import { defineType, defineField } from "sanity";

const cardFields = [
  defineField({
    name: "image",
    title: "Background Image",
    type: "image",
    options: { hotspot: true },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "overlayStrength",
    title: "Overlay Strength",
    type: "string",
    options: {
      list: [
        { title: "None", value: "none" },
        { title: "Light (35%)", value: "light" },
        { title: "Dark (50%)", value: "dark" },
        { title: "Darker (75%)", value: "darker" },
      ],
      layout: "radio",
    },
    initialValue: "dark",
    description: "Controls the dark overlay over the background image.",
  }),
  defineField({
    name: "heading",
    title: "Heading",
    type: "localizedString",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "subheading",
    title: "Subheading (optional)",
    type: "localizedString",
    description: "Small accent label shown below the heading (e.g. 'First Set').",
  }),
  defineField({
    name: "price",
    title: "Price (¥, optional)",
    type: "number",
  }),
  defineField({
    name: "taxIncluded",
    title: "Tax Included?",
    type: "boolean",
    description: 'Appends "(Tax included)" / "（税込）" after the price.',
    initialValue: false,
  }),
  defineField({
    name: "helperText",
    title: "Helper Text (optional)",
    type: "localizedRichText",
    description: "Multiline rich text shown below the price.",
  }),
];

export const imagePairWithContent = defineType({
  name: "imagePairWithContent",
  title: "Image Pair with Content",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
    defineField({
      name: "contentAlignment",
      title: "Content Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
    }),
    defineField({
      name: "items",
      title: "Cards (exactly 2)",
      type: "array",
      of: [
        {
          type: "object",
          fields: cardFields,
          preview: {
            select: { title: "heading.en", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Card", media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(2),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle (below cards, optional)",
      type: "localizedRichText",
      description: "Rich text shown below both cards on a plain background.",
    }),
  ],
  preview: {
    select: { title: "internalTitle", media: "items.0.image" },
    prepare({ title, media }) {
      return { title: "Image Pair with Content", subtitle: title, media };
    },
  },
});
