import { defineType, defineField } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
    defineField({
      name: "ja",
      title: "Japanese",
      type: "string",
    }),
  ],
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
    }),
    defineField({
      name: "ja",
      title: "Japanese",
      type: "text",
    }),
  ],
});
