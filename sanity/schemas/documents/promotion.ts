import { defineType, defineField } from "sanity";

export const promotion = defineType({
  name: "promotion",
  title: "Promotion Bar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Promotion Bar",
      readOnly: true,
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: false,
      description: "Show the promotion bar across all pages.",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "localizedString",
      description: "The scrolling message displayed in the banner.",
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
      description: '"Right → Left" is the classic ticker direction.',
    }),
  ],
  preview: {
    select: { title: "title", enabled: "enabled" },
    prepare({ title, enabled }: { title?: string; enabled?: boolean }) {
      return { title: title || "Promotion Bar", subtitle: enabled ? "Active" : "Inactive" };
    },
  },
});
