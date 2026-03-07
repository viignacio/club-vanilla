import { defineType, defineField } from "sanity";

export const compactHeroBanner = defineType({
  name: "compactHeroBanner",
  title: "Compact Hero Banner",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
    defineField({
      name: "backgroundType",
      title: "Background Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.backgroundType !== "image",
    }),
    defineField({
      name: "backgroundVideo",
      title: "Background Video",
      type: "object",
      hidden: ({ parent }) => parent?.backgroundType !== "video",
      fields: [
        defineField({
          name: "videoFile",
          title: "Video File (MP4)",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
        }),
        defineField({
          name: "posterImage",
          title: "Poster / Fallback Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
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
      name: "heading",
      title: "Heading",
      type: "localizedString",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "localizedString",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA Button",
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
      name: "textAnimation",
      title: "Text Animation",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Fade In", value: "fadeIn" },
          { title: "Slide Up", value: "slideUp" },
          { title: "Typewriter", value: "typewriter" },
        ],
      },
      initialValue: "fadeIn",
    }),
    defineField({
      name: "overlayOpacity",
      title: "Overlay Opacity (%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 50,
    }),
  ],
  preview: {
    select: { title: "internalTitle" },
    prepare({ title }) {
      return { title: "Compact Hero Banner", subtitle: title };
    },
  },
});
