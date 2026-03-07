import { defineType, defineField } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
    }),
    defineField({
      name: "headingAlignment",
      title: "Heading Alignment",
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
      name: "items",
      title: "FAQ Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "localizedText",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "question.en" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "internalTitle" },
    prepare({ title }) {
      return { title: "FAQ Section", subtitle: title };
    },
  },
});
