import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "localizedString",
    }),
    defineField({
      name: "logo",
      title: "Logo Image",
      type: "image",
      description: "Displayed in the navbar. Falls back to the site name text if not set.",
      options: { hotspot: true },
    }),
    defineField({
      name: "nav",
      title: "Navigation",
      type: "array",
      of: [
        {
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
              description: 'e.g. "/menu", "/parking", "/recruit"',
            }),
          ],
          preview: {
            select: { title: "label.en", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "copyrightText",
          title: "Copyright Text",
          type: "localizedString",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "localizedString",
        }),
        defineField({
          name: "hours",
          title: "Business Hours",
          type: "localizedString",
        }),
        defineField({
          name: "socialLinks",
          title: "Social Links",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "platform",
                  title: "Platform",
                  type: "string",
                  options: {
                    list: [
                      { title: "Instagram", value: "instagram" },
                      { title: "Twitter/X", value: "twitter" },
                      { title: "Facebook", value: "facebook" },
                      { title: "LINE", value: "line" },
                    ],
                  },
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "url",
                }),
              ],
              preview: {
                select: { title: "platform", subtitle: "url" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "localizedString",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
