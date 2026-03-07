import { defineType, defineField } from "sanity";

export const dictionary = defineType({
  name: "dictionary",
  title: "Dictionary",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Site Dictionary",
      readOnly: true,
    }),
    defineField({
      name: "entries",
      title: "Entries",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Key",
              type: "string",
              description: 'Dot-notation key, e.g. "nav.home", "cta.reserve"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "en",
              title: "English",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "ja",
              title: "Japanese",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "key", subtitle: "en" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
