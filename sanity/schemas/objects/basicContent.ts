import { defineType, defineField } from "sanity";

export const basicContent = defineType({
  name: "basicContent",
  title: "Basic Content",
  type: "object",
  fieldsets: [
    {
      name: "general",
      title: "General",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "textContent",
      title: "Text Content",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "media",
      title: "Media",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "cta",
      title: "CTA",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
      fieldset: "general",
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
      fieldset: "general",
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
      fieldset: "textContent",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localizedString",
      fieldset: "textContent",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localizedRichText",
      fieldset: "textContent",
    }),
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      options: { hotspot: true },
      fieldset: "media",
    }),
    defineField({
      name: "video",
      title: "Video (optional)",
      type: "file",
      options: {
        accept: "video/*",
      },
      description: "Upload a video file. If both image and video are provided, video takes precedence.",
      fieldset: "media",
    }),
    defineField({
      name: "mediaPosition",
      title: "Media Position",
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
      fieldset: "media",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps Embed URL (optional)",
      type: "string",
      description:
        'Paste the embed src URL from Google Maps → Share → Embed a map. Starts with "https://www.google.com/maps/embed?pb=..."',
      fieldset: "media",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA Button (optional)",
      type: "object",
      fieldset: "cta",
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
  ],
  preview: {
    select: { title: "internalTitle", media: "image" },
    prepare({ title, media }) {
      return { title: "Basic Content", subtitle: title, media };
    },
  },
});
