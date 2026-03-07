import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "club-vanilla",
  title: "Club Vanilla CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Dictionary")
              .id("dictionary")
              .child(
                S.document()
                  .schemaType("dictionary")
                  .documentId("dictionary")
              ),
            S.listItem()
              .title("Promotion Bar")
              .id("promotion")
              .child(
                S.document()
                  .schemaType("promotion")
                  .documentId("promotion")
              ),
            S.divider(),
            S.listItem()
              .title("Pages")
              .child(S.documentTypeList("page")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
