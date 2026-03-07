import { defineType, defineField } from "sanity";

const highlightAnnotation = {
  name: "highlight",
  type: "object",
  title: "Highlight (Pink)",
  fields: [
    {
      name: "color",
      type: "string",
      title: "Color",
      initialValue: "pink",
      options: {
        list: [{ title: "Pink", value: "pink" }],
      },
    },
  ],
};

const neonTextBlock = {
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  marks: {
    decorators: [{ title: "Bold", value: "strong" }],
    annotations: [highlightAnnotation],
  },
};

export const neonCampaign = defineType({
  name: "neonCampaign",
  title: "Neon Campaign",
  type: "object",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Section Title (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "sectionSubtitle",
      title: "Section Subtitle (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "campaignLabel",
      title: "Campaign Label (optional)",
      type: "localizedString",
      description: "Short headline inside the neon box, e.g. '🎉 Opening campaign now underway 🎉'",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "array",
          of: [neonTextBlock],
        },
        {
          name: "ja",
          title: "Japanese",
          type: "array",
          of: [neonTextBlock],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "sectionTitle.en" },
    prepare({ title }) {
      return { title: title || "Neon Campaign" };
    },
  },
});
