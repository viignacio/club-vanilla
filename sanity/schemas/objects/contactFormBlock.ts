import { defineType, defineField } from "sanity";

export const contactFormBlock = defineType({
  name: "contactFormBlock",
  title: "Contact Form",
  type: "object",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Internal label for this block. Not shown on the frontend.",
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
  ],
  preview: {
    select: { title: "internalTitle" },
    prepare({ title }) {
      return { title: "Contact Form", subtitle: title };
    },
  },
});
