import { defineType, defineField } from "sanity";

export const imageWithContent = defineType({
  name: "imageWithContent",
  title: "Image with Content",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
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
      initialValue: "none",
      description: "Controls the dark overlay over the background image to improve text readability.",
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
      name: "marquee",
      title: "Marquee (optional)",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "localizedString",
        }),
        defineField({
          name: "direction",
          title: "Scroll Direction",
          type: "string",
          options: {
            list: [
              { title: "Right → Left (default)", value: "left" },
              { title: "Left → Right", value: "right" },
            ],
            layout: "radio",
          },
          initialValue: "left",
        }),
      ],
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "localizedString",
      description: "The eyebrow label shown above the logo (e.g. PHILIPPINE PUB).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo (optional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "subheading",
      title: "Subheading (optional)",
      type: "localizedString",
    }),
    defineField({
      name: "helperText",
      title: "Helper Text (optional)",
      type: "localizedString",
      description: "Small detail text shown below the subheading — good for addresses, hours, etc.",
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
          title: "URL / Email / Phone",
          type: "string",
          description: 'Supports https://, mailto:, or tel: (e.g. "tel:09012345678")',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "internalTitle", media: "backgroundImage" },
    prepare({ title, media }) {
      return { title: "Image with Content", subtitle: title, media };
    },
  },
});
