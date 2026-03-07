import { defineType, defineField } from "sanity";

export const basicContent = defineType({
  name: "basicContent",
  title: "Basic Content",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Center (full width)", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps Embed URL (optional)",
      type: "string",
      description:
        'Paste the embed src URL from Google Maps → Share → Embed a map. Starts with "https://www.google.com/maps/embed?pb=..."',
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
      initialValue: "left",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localizedString",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localizedRichText",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA Button (optional)",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "localizedString",
        }),
        defineField({
          name: "href",
          title: "URL",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      options: {
        list: [
          { title: "Dark", value: "dark" },
          { title: "Pink Tint", value: "pink" },
          { title: "Purple Tint", value: "purple" },
        ],
      },
      initialValue: "dark",
    }),
  ],
  preview: {
    select: { title: "heading.en", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Basic Content", media };
    },
  },
});
