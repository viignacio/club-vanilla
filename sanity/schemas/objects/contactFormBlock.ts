import { defineType, defineField } from "sanity";

export const contactFormBlock = defineType({
  name: "contactFormBlock",
  title: "Contact Form",
  type: "object",
  fields: [
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
    select: { title: "sectionHeading.en" },
    prepare({ title }) {
      return { title: title || "Contact Form" };
    },
  },
});
