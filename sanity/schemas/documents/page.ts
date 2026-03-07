import { defineType, defineField } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: 'Use "home", "menu", "parking", or "recruit"',
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "localizedString",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "localizedString",
    }),
    defineField({
      name: "showPromotion",
      title: "Show Promotion Bar",
      type: "boolean",
      initialValue: false,
      description: "Show the promotion banner on this page. The global override in Promotion Bar takes precedence.",
    }),
    defineField({
      name: "blocks",
      title: "Page Blocks",
      type: "array",
      of: [
        { type: "imageWithContent" },
        { type: "imagePairWithContent" },
        { type: "heroBanner" },
        { type: "compactHeroBanner" },
        { type: "basicContent" },
        { type: "faqSection" },
        { type: "menuSection" },
        { type: "contactFormBlock" },
        { type: "neonCampaign" },
      ],
    }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "slug.current" },
    prepare({ title, subtitle }) {
      return { title: title || "Page", subtitle: `/${subtitle}` };
    },
  },
});
